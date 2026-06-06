import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class UpdateBrandDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;
}
