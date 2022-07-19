import { useStore } from "effector-react";
import { useEvent } from "effector-react/scope";
import { useForm } from "react-hook-form";

import { Form, Input } from "../../../../../shared/components";
import { Field } from "../../../../../shared/components/organisms/Field";
import { mockCoins, secondsInDay, termOptions } from "../../../../../shared/constants";
import { $listingStage, setListingTerms, setListingStage } from "../../../model";
import { ListingTerms } from "../../../model/types";

// import styles from "./styles.module.scss";
const styles: any = {};

export const InitialView = () => {
  const form = useForm<ListingTerms>();
  const stage = useStore($listingStage);

  const handlers = useEvent({
    setListingStage,
    setListingTerms,
  });

  if (stage !== "initial") return null;

  return (
    <Form form={form} onSubmit={handlers.setListingTerms} className={styles.form}>
      <Field name="desiredOffer.amount">
        <Input type="number" label="Amount" placeholder="amount" />
      </Field>
      <Field name="desiredOffer.amountWithAPR">
        <Input type="number" label="amountWithAPR" placeholder="amountWithAPR" />
      </Field>

      <label>
        Coin
        <Field name="desiredOffer.coinID" defaultValue={mockCoins[0].id}>
          <select placeholder="coin">
            {mockCoins.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.symbol}
              </option>
            ))}
          </select>
        </Field>
      </label>

      <label>
        max duration
        <Field name="offerDefaultDuration" defaultValue={termOptions[0] * secondsInDay}>
          <select placeholder="maxDuration">
            {termOptions.map((option) => (
              <option key={option} value={option * secondsInDay}>
                {option} days
              </option>
            ))}
          </select>
        </Field>
      </label>

      <label>
        term
        <Field name="desiredOffer.lendSeconds" defaultValue={termOptions[0] * secondsInDay}>
          <select placeholder="duration">
            {termOptions.map((option) => (
              <option key={option} value={option * secondsInDay}>
                {option} days
              </option>
            ))}
          </select>
        </Field>
      </label>

      <button type="submit">Next</button>
    </Form>
  );
};
