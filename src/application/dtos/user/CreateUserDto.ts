import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsOptional()
    phone?: string

    @IsString()
    @IsOptional()
    department?: string;

    @IsString()
    @IsNotEmpty()
    role: string;
}