import {v4 as uuidv4} from 'uuid';

export default class UidManager {
  static prefixes = {
    'user': 'usr',
    'member': 'mbr',
    'church': 'chr',
  };

  public static generate(entityName: string): string {
    let uuid = uuidv4();
    const prefix = this.prefixes[entityName];

    return `${prefix}-${uuid}`
  }

  public static generateToken(): string {
    return uuidv4();
  }
}
