import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PersonBuilder, createPerson } from '../src/builders/PersonBuilder.js';
import { ValidationError } from '../src/builders/ComponentBuilder.js';

describe('PersonBuilder', () => {
  it('构建基本 Person 组件', () => {
    const builder = new PersonBuilder();
    const result = builder.setUserId('ou_123').build();
    assert.equal(result.tag, 'person');
    assert.equal(result.user_id, 'ou_123');
  });

  it('设置所有可选属性', () => {
    const result = new PersonBuilder()
      .setUserId('ou_xxx')
      .setIdType('open_id')
      .setSize('medium')
      .setCapsule(true)
      .setAvatar('https://example.com/avatar.png')
      .setTitle('张三')
      .setSubtitle('工程师')
      .setDescription('负责 AI 开发')
      .build();
    
    assert.equal(result.user_id, 'ou_xxx');
    assert.equal(result.id_type, 'open_id');
    assert.equal(result.size, 'medium');
    assert.equal(result.capsule, true);
    assert.equal(result.avatar, 'https://example.com/avatar.png');
    assert.equal(result.title, '张三');
    assert.equal(result.subtitle, '工程师');
    assert.equal(result.description, '负责 AI 开发');
  });

  it('链式调用返回 this', () => {
    const builder = new PersonBuilder();
    assert.strictEqual(builder.setUserId('ou_test'), builder);
    assert.strictEqual(builder.setIdType('user_id'), builder);
    assert.strictEqual(builder.setSize('large'), builder);
    assert.strictEqual(builder.setCapsule(false), builder);
  });

  it('user_id 为必填字段', () => {
    const builder = new PersonBuilder();
    assert.throws(() => builder.build(), ValidationError);
  });

  it('user_id 为空字符串时校验失败', () => {
    const builder = new PersonBuilder().setUserId('');
    assert.throws(() => builder.build(), ValidationError);
  });

  it('size 只接受有效枚举值', () => {
    const validSizes = ['small', 'medium', 'large'];
    for (const size of validSizes) {
      const result = new PersonBuilder().setUserId('ou_test').setSize(size).build();
      assert.equal(result.size, size);
    }
  });

  it('size 传入无效值时校验失败', () => {
    const builder = new PersonBuilder().setUserId('ou_test').setSize('xlarge');
    assert.throws(() => builder.build(), ValidationError);
  });

  it('capsule 必须是布尔值', () => {
    const result1 = new PersonBuilder().setUserId('ou_test').setCapsule(true).build();
    assert.equal(result1.capsule, true);
    const result2 = new PersonBuilder().setUserId('ou_test').setCapsule(false).build();
    assert.equal(result2.capsule, false);
  });

  it('capsule 传入非布尔值时校验失败', () => {
    const builder = new PersonBuilder().setUserId('ou_test').setCapsule('yes');
    assert.throws(() => builder.build(), ValidationError);
  });

  it('addBadge 添加徽章', () => {
    const builder = new PersonBuilder()
      .setUserId('ou_test')
      .addBadge({ text: 'MVP', color: '#FF9900' })
      .addBadge({ text: 'Expert', color: '#00AA00' });
    const result = builder.build();
    assert.equal(result.badges.length, 2);
    assert.equal(result.badges[0].text, 'MVP');
    assert.equal(result.badges[1].text, 'Expert');
  });

  it('clearBadges 清空徽章', () => {
    const builder = new PersonBuilder()
      .setUserId('ou_test')
      .addBadge({ text: 'MVP' })
      .clearBadges();
    const result = builder.build();
    assert.ok(!result.badges || result.badges.length === 0);
  });

  it('setAction 设置点击行为', () => {
    const action = { tag: 'open_url', url: 'https://example.com' };
    const result = new PersonBuilder().setUserId('ou_test').setAction(action).build();
    assert.deepEqual(result.action, action);
  });

  it('avatar 必须是有效 URL', () => {
    const result = new PersonBuilder()
      .setUserId('ou_test')
      .setAvatar('https://example.com/avatar.png')
      .build();
    assert.equal(result.avatar, 'https://example.com/avatar.png');
  });

  it('avatar 传入无效 URL 时校验失败', () => {
    const builder = new PersonBuilder().setUserId('ou_test').setAvatar('not-a-url');
    assert.throws(() => builder.build(), ValidationError);
  });

  it('avatar 可选（空值不报错）', () => {
    const result = new PersonBuilder().setUserId('ou_test').build();
    assert.equal(result.avatar, undefined);
  });

  it('createPerson 工厂函数', () => {
    const result = createPerson({
      user_id: 'ou_factory',
      title: '工厂函数测试',
      size: 'small'
    });
    assert.equal(result.user_id, 'ou_factory');
    assert.equal(result.title, '工厂函数测试');
    assert.equal(result.size, 'small');
  });

  it('reset 重置构建器', () => {
    const builder = new PersonBuilder()
      .setUserId('ou_test')
      .setTitle('测试');
    builder.reset();
    assert.throws(() => builder.build(), ValidationError);
  });

  it('getData 获取数据副本', () => {
    const builder = new PersonBuilder().setUserId('ou_test').setTitle('标题');
    const data = builder.getData();
    assert.equal(data.user_id, 'ou_test');
    assert.equal(data.title, '标题');
    data.user_id = 'modified';
    assert.equal(builder.getData().user_id, 'ou_test');
  });

  it('toJSON 不包含 undefined 字段', () => {
    const result = new PersonBuilder()
      .setUserId('ou_test')
      .setIdType('open_id')
      .build();
    assert.equal(result.tag, 'person');
    assert.equal(result.user_id, 'ou_test');
    assert.equal(result.id_type, 'open_id');
    assert.equal(result.size, undefined);
    assert.equal(result.badges, undefined);
  });

  it('多次 build 调用生成独立副本', () => {
    const builder = new PersonBuilder()
      .setUserId('ou_test')
      .addBadge({ text: 'Badge1' });
    const result1 = builder.build();
    builder.addBadge({ text: 'Badge2' });
    const result2 = builder.build();
    assert.equal(result1.badges.length, 1);
    assert.equal(result2.badges.length, 2);
  });
});
