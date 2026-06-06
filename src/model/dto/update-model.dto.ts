import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID, IsOptional } from "class-validator";

export class UpdateModelDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  brand_id?: string;
}
