
import { Operation } from '@/types/editor';

export class OperationalTransform {
  static transform(op1: Operation, op2: Operation): Operation[] {
    // Transform operation op1 against operation op2
    // This is a simplified implementation of operational transformation
    
    if (op1.type === 'retain') return [op1];
    if (op2.type === 'retain') return [op1];

    if (op1.type === 'insert' && op2.type === 'insert') {
      if (op1.position <= op2.position) {
        return [op1, { ...op2, position: op2.position + (op1.content?.length || 0) }];
      } else {
        return [{ ...op1, position: op1.position + (op2.content?.length || 0) }, op2];
      }
    }

    if (op1.type === 'insert' && op2.type === 'delete') {
      if (op1.position <= op2.position) {
        return [op1, { ...op2, position: op2.position + (op1.content?.length || 0) }];
      } else {
        const deleteEnd = op2.position + (op2.length || 0);
        if (op1.position >= deleteEnd) {
          return [{ ...op1, position: op1.position - (op2.length || 0) }, op2];
        } else {
          // Insert position is within delete range
          return [{ ...op1, position: op2.position }, op2];
        }
      }
    }

    if (op1.type === 'delete' && op2.type === 'insert') {
      if (op2.position <= op1.position) {
        return [{ ...op1, position: op1.position + (op2.content?.length || 0) }, op2];
      } else {
        const deleteEnd = op1.position + (op1.length || 0);
        if (op2.position >= deleteEnd) {
          return [op1, { ...op2, position: op2.position - (op1.length || 0) }];
        } else {
          // Insert position is within delete range
          return [op1, { ...op2, position: op1.position }];
        }
      }
    }

    if (op1.type === 'delete' && op2.type === 'delete') {
      if (op1.position <= op2.position) {
        const op1End = op1.position + (op1.length || 0);
        if (op1End <= op2.position) {
          return [op1, { ...op2, position: op2.position - (op1.length || 0) }];
        } else {
          // Overlapping deletes - merge them
          const newLength = Math.max(op1End, op2.position + (op2.length || 0)) - op1.position;
          return [{ ...op1, length: newLength }];
        }
      } else {
        const op2End = op2.position + (op2.length || 0);
        if (op2End <= op1.position) {
          return [{ ...op1, position: op1.position - (op2.length || 0) }, op2];
        } else {
          // Overlapping deletes - merge them
          const newLength = Math.max(op2End, op1.position + (op1.length || 0)) - op2.position;
          return [{ ...op2, length: newLength }];
        }
      }
    }

    return [op1];
  }

  static applyOperation(text: string, operation: Operation): string {
    switch (operation.type) {
      case 'insert':
        return text.slice(0, operation.position) + 
               (operation.content || '') + 
               text.slice(operation.position);
      
      case 'delete':
        return text.slice(0, operation.position) + 
               text.slice(operation.position + (operation.length || 0));
      
      case 'retain':
        return text;
      
      default:
        return text;
    }
  }
}
