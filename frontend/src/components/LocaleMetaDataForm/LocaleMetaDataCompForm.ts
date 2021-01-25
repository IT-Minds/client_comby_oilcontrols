import { ICreateLocationCommand, IUpdateLocationMetaDataCommand } from "services/backend/nswagts";

export interface LocaleMetaDataForm extends IUpdateLocationMetaDataCommand, ICreateLocationCommand {
  image?: File;
}
