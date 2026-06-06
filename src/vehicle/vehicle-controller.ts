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
import { VehicleService } from "./vehicle.service";
import { CreateVehicleDto } from "./dto/create-vehicle.dto";
import { UpdateVehicleDto } from "./dto/update-vehicle.dto";

@ApiTags("vehicles")
@ApiBearerAuth()
@Controller("vehicles")
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @ApiOperation({ summary: "Register a new vehicle" })
  @ApiResponse({ status: 201, description: "Vehicle registered successfully" })
  async create(@Body() createVehicleDto: CreateVehicleDto, @Req() req: any) {
    const userId = req.user.account_id;
    return await this.vehicleService.create(createVehicleDto, userId);
  }

  @Get()
  @ApiOperation({ summary: "Get all vehicles" })
  @ApiResponse({ status: 200, description: "Return all vehicles" })
  async findAll() {
    return await this.vehicleService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get vehicle by id" })
  @ApiResponse({ status: 200, description: "Return vehicle details" })
  @ApiResponse({ status: 404, description: "Vehicle not found" })
  async findOne(@Param("id") id: string) {
    return await this.vehicleService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update vehicle information" })
  @ApiResponse({ status: 200, description: "Vehicle updated successfully" })
  async update(@Param("id") id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return await this.vehicleService.update(id, updateVehicleDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete vehicle" })
  @ApiResponse({ status: 200, description: "Vehicle deleted successfully" })
  async remove(@Param("id") id: string) {
    return await this.vehicleService.remove(id);
  }
}
