import { ComponentBuilder, ValidationError } from './ComponentBuilder.js';

const ALLOWED_SIZES = ['small', 'medium', 'large'];

export class PersonBuilder extends ComponentBuilder {
  constructor() {
    super('person');
    this._data = {};
    this._badges = [];
  }

  setUserId(userId) {
    this._data.user_id = userId;
    return this;
  }

  setIdType(idType) {
    this._data.id_type = idType;
    return this;
  }

  setSize(size) {
    this._data.size = size;
    return this;
  }

  setCapsule(capsule) {
    this._data.capsule = capsule;
    return this;
  }

  setAvatar(avatar) {
    this._data.avatar = avatar;
    return this;
  }

  setTitle(title) {
    this._data.title = title;
    return this;
  }

  setSubtitle(subtitle) {
    this._data.subtitle = subtitle;
    return this;
  }

  setDescription(description) {
    this._data.description = description;
    return this;
  }

  addBadge(badge) {
    this._badges.push(badge);
    return this;
  }

  clearBadges() {
    this._badges = [];
    this._data.badges = [];
    return this;
  }

  setAction(action) {
    this._data.action = action;
    return this;
  }

  validate() {
    this.validateRequired('user_id', this._data.user_id, 'user_id');
    this.validateEnum('size', this._data.size, ALLOWED_SIZES, 'size');
    this.validateBoolean('capsule', this._data.capsule, 'capsule');
    this.validateString('id_type', this._data.id_type, 'id_type');
    this.validateUrl('avatar', this._data.avatar, 'avatar');
    this.validateString('title', this._data.title, 'title');
    this.validateString('subtitle', this._data.subtitle, 'subtitle');
    this.validateString('description', this._data.description, 'description');
    this.validateArray('badges', this._badges, 'badges');
  }

  build() {
    this.validate();
    return this.toJSON();
  }

  toJSON() {
    const result = {};
    result.tag = 'person';
    result.user_id = this._data.user_id;
    if (this._data.id_type !== undefined) result.id_type = this._data.id_type;
    if (this._data.size !== undefined) result.size = this._data.size;
    if (this._data.capsule !== undefined) result.capsule = this._data.capsule;
    if (this._data.avatar !== undefined) result.avatar = this._data.avatar;
    if (this._data.title !== undefined) result.title = this._data.title;
    if (this._data.subtitle !== undefined) result.subtitle = this._data.subtitle;
    if (this._data.description !== undefined) result.description = this._data.description;
    if (this._data.action !== undefined) result.action = this._data.action;
    if (this._badges.length > 0) {
      result.badges = [...this._badges];
    }
    return result;
  }

  getData() {
    return { ...this._data };
  }

  reset() {
    this._data = {};
    this._badges = [];
    return this;
  }
}

export function createPerson(config) {
  const builder = new PersonBuilder();
  if (config.user_id) builder.setUserId(config.user_id);
  if (config.id_type) builder.setIdType(config.id_type);
  if (config.size) builder.setSize(config.size);
  if (config.capsule !== undefined) builder.setCapsule(config.capsule);
  if (config.avatar) builder.setAvatar(config.avatar);
  if (config.title) builder.setTitle(config.title);
  if (config.subtitle) builder.setSubtitle(config.subtitle);
  if (config.description) builder.setDescription(config.description);
  if (config.badges) {
    builder.clearBadges();
    config.badges.forEach(badge => builder.addBadge(badge));
  }
  if (config.action) builder.setAction(config.action);
  return builder.build();
}

export default PersonBuilder;
