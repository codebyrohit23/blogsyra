import { BaseRepository } from '@core/base.repository';
import { FileDocument } from './file.type';
import { File } from './file.model';

export class FileRepository extends BaseRepository<FileDocument> {
  constructor() {
    super(File);
  }
}
