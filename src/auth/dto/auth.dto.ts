import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignUpDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;
}
