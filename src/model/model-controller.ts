import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ModelService } from "./model.service";
import { CreateModelDto } from "./dto/create-model.dto";
import { UpdateModelDto } from "./dto/update-model.dto";

@ApiTags("models")
@ApiBearerAuth()
@Controller("models")
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Post()
  @ApiOperation({ summary: "Create a new model" })
  @ApiResponse({ status: 201, description: "Model created successfully" })
  async create(@Body() createModelDto: CreateModelDto, @Req() req: any) {
    const userId = req.user.account_id;
    return await this.modelService.create(createModelDto, userId);
  }

  @Get()
  @ApiOperation({ summary: "Get all models" })
  @ApiResponse({ status: 200, description: "Return all models" })
  async findAll() {
    return await this.modelService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get model by id" })
  @ApiResponse({ status: 200, description: "Return model details" })
  @ApiResponse({ status: 404, description: "Model not found" })
  async findOne(@Param("id") id: string) {
    return await this.modelService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update model information" })
  @ApiResponse({ status: 200, description: "Model updated successfully" })
  async update(@Param("id") id: string, @Body() updateModelDto: UpdateModelDto) {
    return await this.modelService.update(id, updateModelDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete model" })
  @ApiResponse({ status: 200, description: "Model deleted successfully" })
  async remove(@Param("id") id: string) {
    return await this.modelService.remove(id);
  }
}
