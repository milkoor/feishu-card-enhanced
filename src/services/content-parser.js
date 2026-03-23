/**
 * Content Parser Service
 * Parses LLM markdown/text responses into structured elements
 */

// Regular expressions for parsing markdown elements
const PATTERNS = {
  // Code block: ```lang\ncode\n``` (non-greedy match for content)
  codeBlock: /```(\w+)?\n([\s\S]*?)```/g,
  // Table: | col1 | col2 |\n| --- | --- |\n| a | b |
  table: /\|([^\n]+)\|\n\|[-\s:|]+\|\n((?:\|[^\n]+\|\n?)+)/g,
  // Image: ![alt](url)
  markdownImage: /!\[([^\]]*)\]\((https?:\/\/[^\s)]+\.(?:jpg|jpeg|png|gif|webp))\)/gi,
  // Raw image URL
  rawImage: /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp))/gi,
  // Ordered list: 1. item
  orderedList: /^(\d+)\.\s+(.+)$/gm,
  // Unordered list: - item or * item or • item
  unorderedList: /^[-*•]\s+(.+)$/gm,
  // Divider: --- or *** (with optional spaces)
  divider: /^(?:---+|\*\*\*+)\s*$/gm,
  // Heading: # ## ###
  heading: /^(#{1,6})\s+(.+)$/gm
};

/**
 * Parse a markdown table into structured data
 * @param {string} tableText - Raw table markdown
 * @returns {Object} - { columns: [], rows: [] }
 */
function parseTable(tableText) {
  const lines = tableText.trim().split('\n').filter(line => line.trim());
  if (lines.length < 2) return null;

  // Parse header row
  const headerLine = lines[0];
  const headers = headerLine
    .split('|')
    .map(cell => cell.trim())
    .filter(cell => cell);

  // Parse data rows (skip separator line at index 1)
  const rows = [];
  for (let i = 2; i < lines.length; i++) {
    const rowLine = lines[i];
    const cells = rowLine
      .split('|')
      .map(cell => cell.trim())
      .filter(cell => cell);
    
    const rowObj = {};
    headers.forEach((header, index) => {
      rowObj[header] = cells[index] || '';
    });
    rows.push(rowObj);
  }

  return {
    columns: headers.map(name => ({ name })),
    rows
  };
}

/**
 * Extract all elements from markdown in order
 * @param {string} content - Raw markdown content
 * @returns {Array} - Array of element objects with type and data
 */
export function parseLLMContent(content) {
  if (!content || typeof content !== 'string') {
    return [];
  }

  const elements = [];
  const processedRanges = []; // Track processed positions to avoid duplicates

  // Helper to check if a position range overlaps with processed ranges
  const isOverlapping = (start, end) => {
    return processedRanges.some(range => 
      (start >= range.start && start < range.end) ||
      (end > range.start && end <= range.end) ||
      (start <= range.start && end >= range.end)
    );
  };

  // Helper to mark range as processed
  const markProcessed = (start, end) => {
    processedRanges.push({ start, end });
  };

  // Find all matches for a pattern and sort by position
  const findMatches = (pattern, type, parser) => {
    const matches = [];
    let match;
    const regex = new RegExp(pattern.source, pattern.flags.replace('g', '') + 'g');
    
    while ((match = regex.exec(content)) !== null) {
      if (!isOverlapping(match.index, match.index + match[0].length)) {
        matches.push({
          type,
          start: match.index,
          end: match.index + match[0].length,
          match,
          parser
        });
      }
    }
    return matches;
  };

  // Collect all potential elements
  const allMatches = [
    ...findMatches(PATTERNS.codeBlock, 'code', (m) => ({
      language: m[1] || 'text',
      content: m[2].trim()
    })),
    ...findMatches(PATTERNS.table, 'table', (m) => parseTable(m[0])),
    ...findMatches(PATTERNS.markdownImage, 'image', (m) => ({
      alt: m[1] || '',
      url: m[2]
    })),
    ...findMatches(PATTERNS.heading, 'heading', (m) => ({
      level: m[1].length,
      text: m[2].trim()
    })),
    ...findMatches(PATTERNS.divider, 'divider', () => ({})),
  ];

  // Sort by position
  allMatches.sort((a, b) => a.start - b.start);

  // Mark processed ranges for block-level elements
  allMatches.forEach(m => markProcessed(m.start, m.end));

  // Process content to extract lists and remaining text
  let currentPos = 0;
  const contentLength = content.length;

  // Helper to extract lists from a text segment
  const extractLists = (text, offset) => {
    const listMatches = [];
    const lines = text.split('\n');
    let lineOffset = offset;
    let currentList = null;
    let currentListType = null;
    let listStartOffset = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineEndOffset = lineOffset + line.length;

      // Check for ordered list item
      const orderedMatch = line.match(/^(\d+)\.\s+(.+)$/);
      // Check for unordered list item
      const unorderedMatch = line.match(/^[-*•]\s+(.+)$/);

      if (orderedMatch) {
        if (currentListType !== 'ordered' || !currentList) {
          // Start new ordered list
          if (currentList) {
            listMatches.push({
              type: 'list',
              start: listStartOffset,
              end: lineOffset,
              data: { ordered: currentListType === 'ordered', items: currentList }
            });
          }
          currentList = [];
          currentListType = 'ordered';
          listStartOffset = lineOffset;
        }
        currentList.push(orderedMatch[2].trim());
      } else if (unorderedMatch) {
        if (currentListType !== 'unordered' || !currentList) {
          // Start new unordered list
          if (currentList) {
            listMatches.push({
              type: 'list',
              start: listStartOffset,
              end: lineOffset,
              data: { ordered: currentListType === 'ordered', items: currentList }
            });
          }
          currentList = [];
          currentListType = 'unordered';
          listStartOffset = lineOffset;
        }
        currentList.push(unorderedMatch[1].trim());
      } else if (line.trim() === '') {
        // Empty line ends current list
        if (currentList) {
          listMatches.push({
            type: 'list',
            start: listStartOffset,
            end: lineOffset,
            data: { ordered: currentListType === 'ordered', items: currentList }
          });
          currentList = null;
          currentListType = null;
        }
      } else {
        // Non-list line ends current list
        if (currentList) {
          listMatches.push({
            type: 'list',
            start: listStartOffset,
            end: lineOffset,
            data: { ordered: currentListType === 'ordered', items: currentList }
          });
          currentList = null;
          currentListType = null;
        }
      }

      lineOffset = lineEndOffset + 1; // +1 for newline
    }

    // Close any remaining list
    if (currentList) {
      listMatches.push({
        type: 'list',
        start: listStartOffset,
        end: offset + text.length,
        data: { ordered: currentListType === 'ordered', items: currentList }
      });
    }

    return listMatches;
  };

  // Process the content sequentially
  while (currentPos < contentLength) {
    // Find next block element
    const nextMatch = allMatches.find(m => m.start >= currentPos);
    
    if (nextMatch) {
      // Process text between current position and next block element
      if (nextMatch.start > currentPos) {
        const textSegment = content.slice(currentPos, nextMatch.start);
        
        // Extract lists from this text segment
        const lists = extractLists(textSegment, currentPos);
        
        // Add lists and remaining text
        let segmentPos = currentPos;
        lists.forEach(list => {
          // Add text before list if any
          if (list.start > segmentPos) {
            const textBefore = content.slice(segmentPos, list.start).trim();
            if (textBefore) {
              elements.push({
                type: 'text',
                data: { content: stripMarkdown(textBefore) }
              });
            }
          }
          // Add list
          elements.push({ type: list.type, data: list.data });
          segmentPos = list.end;
        });
        
        // Add remaining text after last list
        if (segmentPos < nextMatch.start) {
          const remainingText = content.slice(segmentPos, nextMatch.start).trim();
          if (remainingText) {
            elements.push({
              type: 'text',
              data: { content: stripMarkdown(remainingText) }
            });
          }
        }
      }
      
      // Add the block element
      elements.push({
        type: nextMatch.type,
        data: nextMatch.parser(nextMatch.match)
      });
      
      currentPos = nextMatch.end;
    } else {
      const textStart = content.slice(currentPos).search(/\S/);
      const absStart = textStart >= 0 ? currentPos + textStart : currentPos;
      const remainingText = content.slice(absStart);
      if (remainingText.trim()) {
        const lists = extractLists(remainingText, absStart);
        let segPos = absStart;
        lists.forEach(list => {
          if (list.start > segPos) {
            const before = content.slice(segPos, list.start).trim();
            if (before) elements.push({ type: 'text', data: { content: stripMarkdown(before) } });
          }
          elements.push({ type: list.type, data: list.data });
          segPos = list.end;
        });
        if (segPos < absStart + remainingText.length) {
          const tail = content.slice(segPos).trim();
          if (tail) elements.push({ type: 'text', data: { content: stripMarkdown(tail) } });
        }
      }
      break;
    }
  }

  return elements;
}

/**
 * Strip markdown formatting from text while preserving structure
 * @param {string} text - Text with markdown formatting
 * @returns {string} - Clean text
 */
function stripMarkdown(text) {
  return text
    // Remove emphasis markers but keep content
    .replace(/\*\*\*(.+?)\*\*\*/g, '$1')  // ***bold italic***
    .replace(/\*\*(.+?)\*\*/g, '$1')      // **bold**
    .replace(/\*(.+?)\*/g, '$1')          // *italic*
    .replace(/___(.+?)___/g, '$1')        // ___bold italic___
    .replace(/__(.+?)__/g, '$1')          // __bold__
    .replace(/_(.+?)_/g, '$1')            // _italic_
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // [text](url)
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1') // [text][ref]
    // Remove raw image URLs that weren't caught
    .replace(/https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp)/gi, '')
    // Remove blockquotes marker but keep content
    .replace(/^>\s?/gm, '')
    // Normalize whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Parse raw image URLs from text (for standalone image detection)
 * @param {string} text - Text content
 * @returns {Array} - Array of image URLs
 */
export function extractImageUrls(text) {
  if (!text) return [];
  
  const urls = [];
  const markdownMatches = text.matchAll(PATTERNS.markdownImage);
  for (const match of markdownMatches) {
    urls.push(match[2]);
  }
  
  const rawMatches = text.matchAll(PATTERNS.rawImage);
  for (const match of rawMatches) {
    // Check if this URL is already part of a markdown image
    const isMarkdownImage = text.includes(`](${match[1]})`);
    if (!isMarkdownImage) {
      urls.push(match[1]);
    }
  }
  
  return [...new Set(urls)]; // Remove duplicates
}

export default { parseLLMContent, extractImageUrls };
