import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { PersonBuilder } from '../../src/builders/PersonBuilder.js';
import { registry } from '../../src/utils/component-registry.js';

// 注册 person 组件
before(() => {
  registry.register('person', PersonBuilder);
});

describe('Person Component Display', () => {
  it('渲染基础 Person 组件', () => {
    const result = new PersonBuilder()
      .setUserId('ou_123456')
      .build();
    
    assert.equal(result.tag, 'person');
    assert.equal(result.user_id, 'ou_123456');
    assert.ok(!result.size);
    assert.ok(!result.capsule);
  });

  it('渲染带头像的 Person 组件', () => {
    const result = new PersonBuilder()
      .setUserId('ou_avatar')
      .setAvatar('https://example.com/avatar.jpg')
      .setTitle('李四')
      .build();
    
    assert.equal(result.tag, 'person');
    assert.equal(result.avatar, 'https://example.com/avatar.jpg');
    assert.equal(result.title, '李四');
  });

  it('渲染带徽章的 Person 组件', () => {
    const result = new PersonBuilder()
      .setUserId('ou_badges')
      .setTitle('王五')
      .addBadge({ text: 'MVP', color: '#FF9900' })
      .addBadge({ text: 'Top', color: '#00AA00' })
      .build();
    
    assert.equal(result.badges.length, 2);
    assert.equal(result.badges[0].text, 'MVP');
    assert.equal(result.badges[1].text, 'Top');
  });

  it('渲染不同尺寸的 Person 组件', () => {
    const sizes = ['small', 'medium', 'large'];
    for (const size of sizes) {
      const result = new PersonBuilder()
        .setUserId(`ou_${size}`)
        .setSize(size)
        .build();
      assert.equal(result.size, size, `尺寸 ${size} 渲染失败`);
    }
  });

  it('渲染胶囊样式的 Person 组件', () => {
    const result = new PersonBuilder()
      .setUserId('ou_capsule')
      .setCapsule(true)
      .build();
    
    assert.equal(result.capsule, true);
  });

  it('渲染完整信息的 Person 组件', () => {
    const result = new PersonBuilder()
      .setUserId('ou_full')
      .setIdType('open_id')
      .setSize('medium')
      .setCapsule(false)
      .setAvatar('https://example.com/full-avatar.png')
      .setTitle('完整信息用户')
      .setSubtitle('高级工程师')
      .setDescription('负责系统架构设计')
      .addBadge({ text: 'Expert', color: '#0066CC' })
      .setAction({ tag: 'open_url', url: 'https://example.com/profile' })
      .build();
    
    assert.equal(result.tag, 'person');
    assert.equal(result.user_id, 'ou_full');
    assert.equal(result.id_type, 'open_id');
    assert.equal(result.size, 'medium');
    assert.equal(result.capsule, false);
    assert.equal(result.avatar, 'https://example.com/full-avatar.png');
    assert.equal(result.title, '完整信息用户');
    assert.equal(result.subtitle, '高级工程师');
    assert.equal(result.description, '负责系统架构设计');
    assert.equal(result.badges.length, 1);
    assert.deepEqual(result.action, { tag: 'open_url', url: 'https://example.com/profile' });
  });

  it('通过 registry 创建 Person 组件', () => {
    const builder = registry.create('person', { user_id: 'ou_registry' });
    const result = builder.build();
    assert.equal(result.tag, 'person');
    assert.equal(result.user_id, 'ou_registry');
  });

  it('registry 注册表包含 person', () => {
    assert.ok(registry.has('person'));
    assert.ok(registry.get('person') === PersonBuilder);
    assert.ok(registry.list().includes('person'));
  });
});
