import { useMutation } from '@tanstack/react-query';
import { proofsApi, ReportReason } from '../../api/modules/proofs';

export function useReportProof(proofId: string) {
  return useMutation({
    mutationFn: (reason: ReportReason) => proofsApi.report(proofId, reason),
  });
}
