import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNumber, Max, Min, ValidateNested } from 'class-validator';

class LotteryConfigItem {
  @IsInt()
  @Min(1)
  amount: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  probability: number;
}

export class PatchLotteryConfigDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LotteryConfigItem)
  configs: LotteryConfigItem[];
}
