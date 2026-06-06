import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { BrandService } from "./brand.service";
import { CreateBrandDto } from "./dto/create-brand.dto";
import { UpdateBrandDto } from "./dto/update-brand.dto";

@ApiTags("brands")
@ApiBearerAuth()
@Controller("brands")
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @ApiOperation({ summary: "Create a new brand" })
  @ApiResponse({ status: 201, description: "Brand created successfully" })
  async create(@Body() createBrandDto: CreateBrandDto, @Req() req: any) {
    const userId = req.user.account_id;
    return await this.brandService.create(createBrandDto, userId);
  }

  @Get()
  @ApiOperation({ summary: "Get all brands" })
  @ApiResponse({ status: 200, description: "Return all brands" })
  async findAll() {
    return await this.brandService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get brand by id" })
  @ApiResponse({ status: 200, description: "Return brand details" })
  @ApiResponse({ status: 404, description: "Brand not found" })
  async findOne(@Param("id") id: string) {
    return await this.brandService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update brand information" })
  @ApiResponse({ status: 200, description: "Brand updated successfully" })
  async update(@Param("id") id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return await this.brandService.update(id, updateBrandDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete brand" })
  @ApiResponse({ status: 200, description: "Brand deleted successfully" })
  async remove(@Param("id") id: string) {
    return await this.brandService.remove(id);
  }
}
