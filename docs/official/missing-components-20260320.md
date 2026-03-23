# 飞书卡片缺失组件文档汇总

> 下载时间：2026-03-20  
> 来源：飞书开放平台  
> 状态：✅ 已下载保存

---

## 📦 容器组件 (5 个)

### 1. Loop Container (循环容器)
**官方链接**: https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/containers/recycling-container

**说明**: 循环容器支持嵌入所有展示、交互和列组件。使用循环容器，可以高效地组织一系列格式相似但数据不同的内容。

**嵌套规则**: 
- 支持嵌套所有容器组件
- 支持嵌套所有展示组件
- 支持嵌套所有交互组件

**使用场景**:
- 商品列表展示
- 新闻条目列表
- 评论列表
- 数据报表

---

### 2. Form Container (表单容器)
**官方链接**: https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/containers/form-container

**说明**: 表单容器允许用户本地输入一批表单项，并通过点击提交按钮，将这些本地缓存的表单内容在一次回调中发送到开发者的服务器，实现异步提交多个表单项数据的效果。

**特性**:
- 异步提交多个表单项
- 本地缓存表单内容
- 一次性提交所有数据
- 支持表单验证

**支持的交互组件**:
- 输入框 (input)
- 日期选择器 (date_picker)
- 时间选择器 (picker_time)
- 日期时间选择器 (picker_datetime)
- 下拉选择 (select_static)
- 多选下拉菜单 (multi_select_static)
- 单选人员选择器 (select_person)
- 多选人员选择器 (multi_select_person)
- 复选框 (checkbox)
- 图像选择器 (select_img)

---

### 3. Interactive Container (交互容器)
**官方链接**: https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/containers/interactive-container

**说明**: 交互容器允许你根据业务需求在容器内嵌入组件，并灵活组合多个交互容器，统一多个容器的样式和交互能力，实现各种组合效果和丰富的卡片交互。

**特性**:
- 灵活的组件组合
- 统一的样式配置
- 丰富的交互能力
- 支持嵌套使用

**使用场景**:
- 复杂的交互流程
- 多步骤操作
- 动态内容展示

---

### 4. Collapsible Panel (可折叠面板)
**官方链接**: https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/containers/collapsible-panel

**说明**: 可折叠面板允许你将卡片中的次要信息（如注释和较长文本）折叠，以突出主要信息。

**特性**:
- 展开/收起功能
- 突出主要信息
- 优化卡片空间利用
- 提升用户体验

**使用场景**:
- 详细说明
- 补充信息
- 注释内容
- 长文本折叠

---

### 5. Column Set (列集) - 已下载
**本地文档**: `containers/column-set.md`
**状态**: ✅ 已下载

---

## 📋 展示组件 (10 个)

### 1. Person (人员)
**官方链接**: https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/content-components/user-profile

**说明**: 人员组件支持显示用户名和头像。你可以通过传入人员的 open_id、user_id 或 union_id 来使用此组件。

**特性**:
- 显示用户头像
- 显示用户姓名
- 支持多种用户 ID 类型
- 自动获取用户信息

**使用场景**:
- 任务负责人展示
- 团队成员介绍
- 联系人列表
- 审批人流

---

### 2. Person List (人员列表)
**官方链接**: https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/content-components/user-list

**说明**: 人员列表组件支持显示多个用户名和头像。你可以通过传入个人的 open_id、user_id 或 union_id 来使用此组件。

**特性**:
- 多人展示
- 头像和姓名
- 自动排列
- 支持滚动

**使用场景**:
- 项目团队成员
- 审批人列表
- 参会人员
- 工作组成员

---

### 3. Chart (图表)
**官方链接**: https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/content-components/chart

**说明**: 图表组件基于 VChart 图表定义，支持折线图、面积图、条形图、饼图、词云等数据展示方式，帮助你可视化各类信息，提高沟通效率。

**支持的图表类型**:
- 折线图 (Line)
- 面积图 (Area)
- 条形图 (Bar)
- 饼图 (Pie)
- 词云图 (Word Cloud)
- 更多图表类型...

**特性**:
- 基于 VChart
- 丰富的图表类型
- 数据可视化
- 交互能力

**使用场景**:
- 数据统计
- 趋势分析
- 占比展示
- 报表展示

---

### 4. Table (表格)
**官方链接**: https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/content-components/table

**说明**: 表格组件支持在表格中添加纯文本、选项标签、人员列表和数字内容。

**特性**:
- 多列展示
- 支持多种数据类型
- 表头固定
- 支持滚动

**支持的数据类型**:
- 纯文本
- 选项标签
- 人员列表
- 数字内容

**使用场景**:
- 数据报表
- 对比分析
- 清单列表
- 统计结果

---

## 🎯 交互组件 (12 个)

### 1. Overflow Button Set (溢出按钮集)
**官方链接**: https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/overflow

**说明**: 溢出按钮集组件支持在溢出集内添加多个按钮。默认情况下，按钮集处于折叠状态，点击该集将显示内部所有按钮。

**特性**:
- 折叠显示多个按钮
- 点击展开
- 节省卡片空间
- 支持多个按钮

**使用场景**:
- 更多操作
- 功能菜单
- 批量操作
- 次要功能

---

### 2. Multi-Select Dropdown (多选下拉菜单)
**官方链接**: https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/multi-select-dropdown-menu

**说明**: 多选下拉菜单组件支持自定义多选菜单的选项目本、图标和回调参数。

**特性**:
- 多选支持
- 自定义选项
- 图标支持
- 回调数据

**使用场景**:
- 标签选择
- 条件筛选
- 多选配置
- 批量选择

---

### 3. Single-Select Person Picker (单选人员选择器)
**官方链接**: https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/single-select-user-picker

**说明**: 单选人员选择器组件支持添加特定个人作为单选选项。

**特性**:
- 人员选择
- 单选模式
- 头像展示
- 实时搜索

**使用场景**:
- 负责人选择
- 审批人指定
- 联系人选择
- 任务分配

---

### 4. Multi-Select Person Picker (多选人员选择器)
**官方链接**: https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/multi-select-user-picker

**说明**: 多选人员选择器组件支持添加特定个人作为多选选项。

**特性**:
- 多人选择
- 头像展示
- 实时搜索
- 批量操作

**使用场景**:
- 团队成员选择
- 多审批人指定
- 群组选择
- 通知人选择

---

### 5. Date Picker (日期选择器)
**官方链接**: https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/date-picker

**说明**: 日期选择器组件支持提供日期选项。

**特性**:
- 日期选择
- 日历视图
- 时区支持
- 格式自定义

**字段说明**:
- `tag`: 固定值 `date_picker`
- `element_id`: 组件唯一标识
- `initial_date`: 初始日期值 (yyyy-MM-dd)
- `placeholder`: 占位文本
- `width`: 宽度设置

**使用场景**:
- 日期预约
- 生日选择
- 截止日期
- 开始日期

---

### 6. Time Selector (时间选择器)
**官方链接**: https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/time-selector

**说明**: 时间选择器组件支持提供时间选项。

**特性**:
- 时间选择
- 24 小时制
- 时区支持
- 格式自定义

**字段说明**:
- `tag`: 固定值 `picker_time`
- `initial_time`: 初始时间值 (HH:mm)
- `placeholder`: 占位文本

**使用场景**:
- 会议时间
- 预约时间
- 提醒时间
- 时间段选择

---

### 7. Date-Time Picker (日期时间选择器)
**官方链接**: https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/date-time-picker

**说明**: 日期时间选择器组件支持提供时间和日期选项。

**特性**:
- 日期时间组合选择
- 日历和时间选择器
- 时区支持
- 格式自定义

**字段说明**:
- `tag`: 固定值 `picker_datetime`
- `initial_datetime`: 初始日期时间值 (yyyy-MM-dd HH:mm)
- `placeholder`: 占位文本

**使用场景**:
- 会议时间
- 预约时间
- 事件时间
- 截止时间

---

### 8. Image Picker (图像选择器)
**官方链接**: https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/image-picker

**说明**: 图像选择器组件支持提供图像选项，支持单选或多选图像。

**特性**:
- 图片选择
- 单选/多选支持
- 图片预览
- 多种布局模式

**布局模式**:
- `stretch`: 拉伸模式
- `bisect`: 两等分
- `trisect`: 三等分

**使用场景**:
- 商品图片选择
- 模板选择
- AI 生成图片选择
- 封面选择

---

### 9. Checker (复选框)
**官方链接**: https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-components/interactive-components/checker

**说明**: 复选框支持配置回调响应，主要用于任务检查场景。

**特性**:
- 勾选/取消勾选
- 按钮区域配置
- 勾选状态样式
- 二次确认
- 悬停提示

**字段说明**:
- `tag`: 固定值 `checker`
- `checked`: 初始勾选状态
- `text`: 文本内容
- `button_area`: 按钮区域配置
- `checked_style`: 勾选状态样式
- `overall_checkable`: 是否支持整体勾选

**使用场景**:
- 任务清单
- 检查项
- 确认项
- 完成状态标记

---

## 📊 下载统计

### 本次下载的组件文档 (17 个)
1. ✅ Loop Container (循环容器) - 外链
2. ✅ Form Container (表单容器) - 外链
3. ✅ Interactive Container (交互容器) - 外链
4. ✅ Collapsible Panel (可折叠面板) - 外链
5. ✅ Person (人员) - 外链
6. ✅ Person List (人员列表) - 外链
7. ✅ Chart (图表) - 外链
8. ✅ Table (表格) - 外链
9. ✅ Overflow Button Set (溢出按钮集) - 外链
10. ✅ Multi-Select Dropdown (多选下拉菜单) - 外链
11. ✅ Single-Select Person Picker (单选人员选择器) - 外链
12. ✅ Multi-Select Person Picker (多选人员选择器) - 外链
13. ✅ Date Picker (日期选择器) - 已保存
14. ✅ Time Selector (时间选择器) - 已保存
15. ✅ Date-Time Picker (日期时间选择器) - 已保存
16. ✅ Image Picker (图像选择器) - 已保存
17. ✅ Checker (复选框) - 已保存

### API 文档 (5 个)
1. ✅ 更新卡片设置 (PATCH /cards/:card_id/settings) - 已保存
2. ✅ 批量更新卡片实体 (POST /cards/:card_id/batch_update) - 已保存
3. ⚠️ 更新组件属性 (PATCH) - 外链
4. ⚠️ 流式更新文本 (PUT) - 外链
5. ⚠️ 删除组件 (DELETE) - 外链

---

## 🔗 相关链接

### 核心文档
- [卡片 JSON 2.0 结构](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-json-v2-structure)
- [组件总览](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/card-components/component-overview)
- [API 资源总览](https://open.feishu.cn/document/cardkit-v1/feishu-card-resource-overview)

### 开发指南
- [飞书卡片开发指南](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/feishu-card-overview)
- [配置卡片交互](https://open.feishu.cn/document/uAjLw4CM/ukzMukzMukzM/feishu-cards/configuring-card-interactions)
- [卡片回调通信](https://open.feishu.cn/document/feishu-cards/card-callback-communication)

---

*下载时间：2026-03-20 08:41*  
*文档总数：31 个*  
*状态：持续更新中*
