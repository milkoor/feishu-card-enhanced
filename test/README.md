# 测试目录说明

本目录包含飞书任务卡片插件的各种测试、演示和工具脚本。

## 目录结构

```
test/
├── README.md                    # 本文件
├── run-all-tests.js            # 测试主入口 - 运行所有单元测试
│
### 单元测试 (Unit Tests)
├── components-batch-render.test.js   # 组件批量渲染测试
├── person.test.js                   # 人员信息组件测试
│
### 演示脚本 (Demo Scripts) - demo-*.js
├── demo-2.1-demo.js                 # 测试 2.1 演示完整流程
├── demo-2.1-final.js                # 测试 2.1 最终版本：演示完整更新流程
├── demo-2.2-update-demo.js          # 测试 2.2：演示创建 + 更新完整流程
├── demo-manual-create.js            # 手动创建任务卡片测试
├── demo-runner.js                   # 测试运行器 - 生成测试任务数据
├── demo-callback-test.js            # 按钮回调测试逻辑示例
├── demo-update.js                   # 更新功能演示
│
### 开发调试脚本 (Dev/Test Scripts)
├── real-card-test.js                # 真实卡片端到端测试
├── send-card-directly.js            # 直接发送卡片到飞书
├── send-with-api.js                 # 使用 API 发送卡片
├── step1-basic.js                   # 基础步骤测试（含结果输出）
├── test-2.1-update.js               # 测试 2.1 更新功能
├── test-refresh.js                  # 卡片刷新到底部测试
│
### 工具脚本 (Utility Scripts) - util-*.js/cjs
├── util-add-callback.js             # 添加回调注册（ES Module）
├── util-add-callback-reg.cjs        # 添加回调注册（CommonJS）
├── util-fix-callback.cjs            # 修复回调导入问题
├── fix-header.js                    # 修复卡片头部格式
│
### 数据文件
├── header-formats.json              # 头部格式定义
├── step1-results.json               # 步骤1测试结果
├── test-results.json                # 测试结果汇总
├── test-plan.md                     # 测试计划文档
│
### 显示目录
└── display/                         # 显示/可视化相关
```

## 文件命名规范

| 前缀 | 含义 | 示例 |
|------|------|------|
| `demo-` | 演示脚本，展示特定功能 | `demo-2.1-demo.js` |
| `test-` | 功能测试脚本 | `test-2.1-update.js` |
| `util-` | 工具/辅助脚本 | `util-add-callback.js` |
| `*.test.js` | 单元测试文件 | `person.test.js` |

## 快速开始

### 运行所有测试
```bash
node test/run-all-tests.js
```

### 运行单个演示
```bash
# 测试 2.1 演示
node test/demo-2.1-demo.js

# 测试 2.2 更新演示
node test/demo-2.2-update-demo.js

# 手动创建测试
node test/demo-manual-create.js
```

### 单元测试
```bash
# 人员组件测试
node test/person.test.js

# 组件批量渲染测试
node test/components-batch-render.test.js
```

## 主要功能模块

### 1. 卡片创建与更新
- `demo-2.1-demo.js` / `demo-2.1-final.js` - 卡片状态更新演示
- `demo-2.2-update-demo.js` - 完整流程：创建→更新→完成
- `demo-update.js` - 更新功能演示

### 2. 回调测试
- `demo-callback-test.js` - 回调按钮处理逻辑
- `util-add-callback.js` / `util-add-callback-reg.cjs` - 向主程序添加回调注册
- `util-fix-callback.cjs` - 修复回调导入路径

### 3. 发送测试
- `send-card-directly.js` - 直接调用飞书 API 发送
- `send-with-api.js` - 使用封装 API 发送

### 4. 实用工具
- `fix-header.js` - 修复卡片头部颜色格式
- `demo-runner.js` - 生成标准化的测试任务数据

## 注意事项

1. **配置文件**：演示脚本中的 `APP_ID` 和 `APP_SECRET` 需要替换为实际值
2. **网络依赖**：发送卡片的脚本需要网络连接和有效的飞书凭证
3. **状态文件**：部分脚本会读写项目根目录的 `state.json`

## 最近更新

- 2026-03-22: 整理测试文件，统一命名规范，创建本 README
