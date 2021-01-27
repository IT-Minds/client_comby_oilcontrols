import { ICreateLocationCommand, IUpdateLocationMetaDataCommand } from "services/backend/nswagts";

export interface LocaleMetaDataForm extends IUpdateLocationMetaDataCommand, ICreateLocationCommand {
  id?: number;
  image?: File;
}
