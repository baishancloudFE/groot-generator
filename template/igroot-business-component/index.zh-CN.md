---
category: BComponents
type: General
title: 业务组件(请修改此处的英文标题)
subtitle: 表单容器组件(请修改此处的中文标题)
cols: 1
---

表单容器组件(大标题)

## 何时使用

需要构建表单获取表单字段的时候使用(描述性文字)

## 安装方法(请修改您的业务组件的安装方法)

```jsx
  sl add -c igroot-form-container
```

## API

> 组件的使用方法 写在jsx内容中

```jsx
<FormContainer>
  <Row>
    <Col span={8}>
      <FormItem label="备注" name="comment">
        <Input placeholder='输入要搜索的备注关键字'/>
      </FormItem>
    </Col>
    <Col span={8}>
      <FormOption
        option={['submit', 'reset']}
        submitText="搜索"
        onSubmit={this.handleSubmit}
      />
    </Col>
  </Row>
</FormContainer>
```

> 请修改以下内容说明----组件拥有哪些属性和方法

### 属性

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标题 | String | - |
| name | 字段名 | String | - |
| initialValue | 初始值|  |  |
| required | 是否必填 | boolean | false |
| fieldProps | 扩展属性 | Object | - |
