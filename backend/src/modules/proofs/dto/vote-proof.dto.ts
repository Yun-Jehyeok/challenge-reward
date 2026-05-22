import { IsEnum } from 'class-validator';
import { VoteType } from '../entities/proof-vote.entity';

export class VoteProofDto {
  @IsEnum(VoteType)
  vote: VoteType;
}
