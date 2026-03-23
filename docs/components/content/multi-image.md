# Multi-Image Layout 组件

## 组件概述
飞书卡片支持多图组合组件，可以将多张图片按照指定排列方式组合展示。

## Tag
```json
{
  "tag": "img_combination"
}
```

## 字段说明

| 字段名 | 必填 | 类型 | 默认值 | 说明 |
|--------|------|------|--------|------|
| tag | 是 | String | / | 多图组合组件标签，固定为 `img_combination` |
| element_id | 否 | String | 空 | 操作组件的唯一标识符 |
| margin | 否 | String | 0 | 组件外边距 |
| combination_mode | 是 | String | empty | 多图组合模式 |
| combination_transparent | 否 | Boolean | false | 背景是否透明 |
| corner_radius | 否 | String | / | 组合中图片的圆角半径 |
| img_list | 是 | Array | empty | 图片资源 key 数组 |

## 组合模式

| 模式 | 说明 | 最多图片数 |
|------|------|-----------|
| double | 双图组合 | 2 张 |
| triple | 三图组合 | 3 张 |
| bisect | 均分双列组合 | 6 张（3 行×2 列） |
| trisect | 均分三列组合 | 9 张（3 行×3 列） |

## 示例代码

### 双图混排示例

```json
{
  "schema": "2.0",
  "body": {
    "direction": "vertical",
    "padding": "12px 12px 12px 12px",
    "elements": [
      {
        "tag": "img_combination",
        "combination_mode": "double",
        "img_list": [
          {
            "img_key": "img_v2_9dd98485-2900-4d65-ada9-e31d1408dcfg"
          },
          {
            "img_key": "img_v2_9dd98485-2900-4d65-ada9-e31d1408dcfg"
          }
        ],
        "combination_transparent": false,
        "margin": "0px 0px 0px 0px"
      }
    ]
  }
}
```

### 三图混排示例

```json
{
  "schema": "2.0",
  "body": {
    "elements": [
      {
        "tag": "img_combination",
        "combination_mode": "triple",
        "img_list": [
          {
            "img_key": "img_v2_xxx1"
          },
          {
            "img_key": "img_v2_xxx2"
          },
          {
            "img_key": "img_v2_xxx3"
          }
        ]
      }
    ]
  }
}
```

## 注意事项

1. 图片尺寸建议在 1500 × 3000 px 范围内
2. 图片大小不超过 10 MB
3. 图片高宽比不超过 16:9
4. 超出组合模式限制数量的图片不会被显示
5. 少于限制数量时空缺部分会留白
