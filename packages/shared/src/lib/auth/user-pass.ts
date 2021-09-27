import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class UserPass {
  @IsEmail()
  username: string;

  @IsString()
  @MinLength(4)
  @MaxLength(25)
  password: string;
}
