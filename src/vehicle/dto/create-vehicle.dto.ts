import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsInt, IsUUID, Min, Max } from "class-validator";

export class CreateVehicleDto {
  @ApiProperty()
  @IsString()
  license_plate: string;

  @ApiProperty()
  @IsString()
  chassis: string;

  @ApiProperty()
  @IsString()
  renavam: string;

  @ApiProperty()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @ApiProperty()
  @IsUUID()
  model_id: string;
}
