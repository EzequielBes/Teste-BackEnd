import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsInt, IsUUID, IsOptional, Min, Max } from "class-validator";

export class UpdateVehicleDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  license_plate?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  chassis?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  renavam?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year?: number;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  model_id?: string;
}
