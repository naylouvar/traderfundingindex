import type { Plan } from "@prisma/client";
import { savePlan } from "../actions";
import { Field, Select, TextArea, assetClassOptions, drawdownOptions } from "./fields";

export function PlanForm({
  firmId,
  plan,
  firmOptions,
  returnTo,
}: {
  firmId?: string;
  plan?: Plan;
  firmOptions?: Record<string, string>;
  returnTo?: string;
}) {
  return (
    <form action={savePlan} className="grid gap-4 sm:grid-cols-3">
      {firmOptions ? (
        <Select label="Firm" name="firmId" defaultValue={firmId} options={firmOptions} />
      ) : (
        <input type="hidden" name="firmId" value={firmId} />
      )}
      {returnTo && <input type="hidden" name="returnTo" value={returnTo} />}
      {plan && <input type="hidden" name="id" value={plan.id} />}
      <Field label="Plan name" name="name" defaultValue={plan?.name} required placeholder="50K Combine" />
      <Field label="Account size ($)" name="accountSizeUsd" type="number" defaultValue={plan?.accountSizeUsd} required />
      <Select label="Asset class" name="assetClass" defaultValue={plan?.assetClass ?? "FUTURES"} options={assetClassOptions} />
      <Field label="Price ($)" name="priceUsd" defaultValue={plan?.priceUsd?.toString()} />
      <Field label="Activation fee ($)" name="activationFeeUsd" defaultValue={plan?.activationFeeUsd?.toString()} />
      <Field label="Reset fee ($)" name="resetFeeUsd" defaultValue={plan?.resetFeeUsd?.toString()} />
      <Field label="Data fee ($/month)" name="dataFeeUsd" defaultValue={plan?.dataFeeUsd?.toString()} />
      <Field label="Profit target ($)" name="profitTargetUsd" type="number" defaultValue={plan?.profitTargetUsd} />
      <Field label="Max drawdown ($)" name="maxDrawdownUsd" type="number" defaultValue={plan?.maxDrawdownUsd} />
      <Field label="Daily loss limit ($)" name="dailyLossLimitUsd" type="number" defaultValue={plan?.dailyLossLimitUsd} />
      <Select label="Drawdown type" name="drawdownType" defaultValue={plan?.drawdownType} options={drawdownOptions} allowEmpty />
      <Field label="Max contracts" name="maxContracts" type="number" defaultValue={plan?.maxContracts} />
      <Field label="Phases" name="phases" type="number" defaultValue={plan?.phases} />
      <Field label="Min trading days" name="minTradingDays" type="number" defaultValue={plan?.minTradingDays} />
      <Field label="Profit split (trader %)" name="profitSplitPct" type="number" defaultValue={plan?.profitSplitPct} />
      <Field label="Payout frequency" name="payoutFrequency" defaultValue={plan?.payoutFrequency} placeholder="Every 5 trading days" />
      <TextArea label="Scaling notes" name="scalingNotes" defaultValue={plan?.scalingNotes} className="sm:col-span-2" />
      {plan && <Field label="Source of this change (optional)" name="sourceUrl" type="url" />}
      <div className="sm:col-span-3">
        <button className="btn-primary">{plan ? "Save plan" : "Add plan"}</button>
      </div>
    </form>
  );
}
