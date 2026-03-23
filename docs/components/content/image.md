# Image 组件

## 组件概述
飞书卡片支持图片组件，可以通过上传图片获取图片 key 来丰富卡片内容。

## Tag
```json
{
  "tag": "img"
}
```

## 字段说明

| 字段名 | 必填 | 类型 | 默认值 | 说明 |
|--------|------|------|--------|------|
| tag | 是 | String | / | 组件标签，固定为 `img` |
| element_id | 否 | String | 空 | 操作组件的唯一标识符 |
| margin | 否 | String | 0 | 组件外边距 |
| img_key | 是 | String | / | 图片资源的 key |
| alt | 是 | Struct | / | 鼠标悬停时的描述文字 |
| title | 否 | Struct | / | 图片标题 |
| corner_radius | 否 | String | / | 图片圆角半径，单位 px |
| scale_type | 否 | String | crop_center | 图片裁剪模式 |
| size | 否 | String | / | 图片尺寸 |
| transparent | 否 | Boolean | false | 背景是否透明 |
| preview | 否 | Boolean | true | 是否支持点击放大 |

## 示例代码

```json
{
  "schema": "2.0",
  "body": {
    "direction": "vertical",
    "padding": "12px 12px 12px 12px",
    "elements": [
      {
        "tag": "img",
        "img_key": "img_v2_9dd98485-2900-4d65-ada9-e31d1408dcfg",
        "preview": true,
        "transparent": false,
        "scale_type": "crop_center",
        "size": "stretch",
        "alt": {
          "tag": "plain_text",
          "content": "示例图片"
        },
        "corner_radius": "5%",
        "margin": "0px 0px 0px 0px",
        "element_id": "demoimg01"
      }
    ]
  }
}
```

## 注意事项

1. 图片尺寸建议在 1500 × 3000 px 范围内
2. 图片大小不超过 10 MB
3. 图片高宽比不超过 16:9
4. JSON 2.0 结构不再支持 `size: stretch_without_padding`，需使用负 margin 实现全宽效果
5. 支持移动端和桌面端不同字体大小定义
