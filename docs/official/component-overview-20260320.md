# 组件总览 - 飞书卡片 JSON 2.0

> 来源：飞书开放平台官方文档  
> 更新时间：2026-03-20  
> 状态：✅ 已下载

## 组件分类

卡片 JSON 2.0 版本中的组件可以分为容器组件、展示类组件和交互类组件。除了回收容器外，所有组件都可以使用卡片 JSON 代码构建。除了可折叠面板、多图选择和复选框外，所有组件都可以与卡片构建工具一起使用。在 JSON 结构中，组件通过定义 `tag` 字段来声明其类型。

## 容器组件

容器组件用于布局内容或配置交互逻辑。展示组件和交互组件都可以添加到容器组件中。

| 组件 | 构建工具支持 | 描述 |
|------|----------|------|
| [Column Set (column_set)](./containers/column-set.md) | ✓ | 列集支持多列水平排列，在列内自由组合图文内容，构建数据表格、商品或文章列表、出行信息等，创建视觉丰富且交互性强的卡片。 |
| [Loop Container](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-components/containers/recycling-container) | ✓ | 循环容器支持嵌入所有展示、交互和列组件。使用循环容器，可以高效地组织一系列格式相似但数据不同的内容。 |
| [Form Container (form)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/containers/form-container) | ✓ | 表单容器允许用户本地输入一批表单项，并通过点击提交按钮，将这些本地缓存的表单内容在一次回调中发送到开发者的服务器，实现异步提交多个表单项数据的效果。 |
| [Interactive Container (interactive_container)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/containers/interactive-container) | × | 交互容器允许你根据业务需求在容器内嵌入组件，并灵活组合多个交互容器，统一多个容器的样式和交互能力，实现各种组合效果和丰富的卡片交互。 |
| [Collapsible Panel (collapsible_panel)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/containers/collapsible-panel) | × | 可折叠面板允许你将卡片中的次要信息（如注释和较长文本）折叠，以突出主要信息。 |

## 展示组件

展示组件构成卡片的主要内容，不具有交互能力。

| 组件 | 构建工具支持 | 客户端版本要求 | 描述 |
|------|----------|----------|------|
| [Title (header)](./content/title.md) | ✓ | - | 标题组件用于构建飞书信片的标题样式和内容，支持添加主标题、副标题、后缀标签和标题图标。 |
| [Plain Text (div)](./content/plain-text.md) | ✓ | - | 纯文本组件支持添加纯文本和前缀图标，并设置文本大小、颜色、对齐方式等显示样式。 |
| [Rich Text (markdown)](./content/rich-text.md) | ✓ | - | 富文本（Markdown）组件支持渲染文本、图像、分隔线等元素。 |
| [Image (img)](./content/image.md) | ✓ | - | 图像组件支持通过调用 [上传图像](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/image/create) 接口或在飞书卡片构建工具的新版本中上传图像来添加图像。 |
| [Multi-Image Layout (img_combination)](./content/multi-image.md) | ✓ | - | 多图布局组件支持通过调用 [上传图像](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/image/create) 接口或在飞书卡片构建工具的新版本中上传图像来添加多个图像。 |
| [Person (person)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/content-components/user-profile) | ✓ | - | 人员组件支持显示用户名和头像。你可以通过传入人员的 open_id、user_id 或 union_id 来使用此组件。 |
| [Person List (person_list)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/content-components/user-list) | ✓ | - | 人员列表组件支持显示多个用户名和头像。你可以通过传入个人的 open_id、user_id 或 union_id 来使用此组件。 |
| [Chart (chart)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/content-components/chart) | × | - | 图表组件基于 [VChart](https://www.visactor.io/) 图表定义，支持折线图、面积图、条形图、饼图、词云等数据展示方式，帮助你可视化各类信息，提高沟通效率。 |
| [Table (table)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/content-components/table) | × | - | 表格组件支持在表格中添加纯文本、选项标签、人员列表和数字内容。 |
| [Divider (hr)](./containers/divider.md) | ✓ | - | 分隔线组件是一条长水平线，用于分隔卡片内容，使展示更清晰。 |

## 交互组件

交互组件为卡片提供交互能力。当用户收到包含交互组件的卡片时，他们可以直接在卡片中访问链接或处理业务。

| 组件 | 构建工具支持 | 客户端版本要求 | 描述 |
|------|----------|----------|------|
| [Input Box (input)](./interactive/input.md) | ✓ | - | 输入框组件支持收集不固定的文本内容，如原因、评估、备注等。 |
| [Button (button)](./interactive/button.md) | ✓ | - | 按钮组件提供配置的按钮回调交互或链接重定向能力，支持多种样式和尺寸。 |
| [Overflow Button Set (overflow)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/overflow) | ✓ | - | 溢出按钮集组件支持在溢出集内添加多个按钮。默认情况下，按钮集处于折叠状态，点击该集将显示内部所有按钮。 |
| [Single-Select Dropdown (select_static)](./interactive/select.md) | ✓ | - | 单选下拉菜单组件支持自定义单选菜单的选项目本、图标和回调参数。 |
| [Multi-Select Dropdown (multi_select_static)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/multi-select-dropdown-menu) | × | - | 多选下拉菜单组件支持自定义多选菜单的选项目本、图标和回调参数。 |
| [Single-Select Person Picker (select_person)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/single-select-user-picker) | ✓ | - | 单选人员选择器组件支持添加特定个人作为单选选项。 |
| [Multi-Select Person Picker (multi_select_person)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/multi-select-user-picker) | × | - | 多选人员选择器组件支持添加特定个人作为多选选项。 |
| [Date Picker (date_picker)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/date-picker) | ✓ | - | 日期选择器组件支持提供日期选项。 |
| [Time Selector (picker_time)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/time-selector) | ✓ | - | 时间选择器组件支持提供时间选项。 |
| [Date-Time Picker (picker_datetime)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/date-time-picker) | × | - | 日期时间选择器组件支持提供时间和日期选项。 |
| [Image Picker (select_img)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/image-picker) | × | - | 图像选择器组件支持提供图像选项，支持单选或多选图像。 |
| [Checker (checker)](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/checker) | × | - | 复选框支持配置回调响应，主要用于任务检查场景。 |

## 客户端版本要求

卡片 JSON 2.0 结构支持飞书客户端 7.20 及以上版本。当使用 JSON 2.0 结构的卡片发送到 7.20 以下版本的客户端时，卡片标题将正常显示，但内容将显示回退升级提示。

---

*下载时间：2026-03-20*
