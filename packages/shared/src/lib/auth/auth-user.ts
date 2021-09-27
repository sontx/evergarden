import { GetUserSettingsDto } from '../user/get-user-settings.dto';

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  photoUrl: string;
  settings: GetUserSettingsDto;
}
