<?php

namespace App\Services;

use App\Models\SubscriptionInvoice;
use App\Models\SubscriptionPayment;
use App\Repositories\SubscriptionPaymentRepository;
use Illuminate\Support\Facades\DB;

class SubscriptionPaymentService
{
    public function __construct(protected SubscriptionPaymentRepository $repository){}


    public function getAll(){
        return $this->repository->getAll();
    }

    public function create(array $data): SubscriptionPayment
    {
        return DB::transaction(function () use ($data) {
            $payment = $this->repository->create($data);
            if (
                $payment->status === 'paid'
                && $payment->subscription_invoice_id
            ) {
                $invoice = SubscriptionInvoice::find(
                    $payment->subscription_invoice_id
                );

                if ($invoice) {
                    $newPaidAmount =
                        (float) $invoice->paid_amount
                        + (float) $payment->amount;

                    $invoice->paid_amount = $newPaidAmount;

                    if ($newPaidAmount >= (float) $invoice->total_amount) {
                        $invoice->status = 'paid';
                    } elseif ($newPaidAmount > 0) {
                        $invoice->status = 'partial';
                    }

                    $invoice->save();
                }
            }

            return $payment;
        });
    }

    public function update(SubscriptionPayment $payment,array $data): SubscriptionPayment
    {
        return DB::transaction(function () use ($payment, $data) {
            $oldStatus = $payment->status;

            $updatedPayment = $this->repository->update(
                $payment,
                $data
            );


            if (
                $oldStatus !== $updatedPayment->status
                && $updatedPayment->subscription_invoice_id
            ) {
                $invoice = SubscriptionInvoice::find(
                    $updatedPayment->subscription_invoice_id
                );

                if ($invoice) {
                
                    $totalPaid = $invoice->payments()
                        ->where('status', 'paid')
                        ->sum('amount');

                    $invoice->paid_amount = $totalPaid;

                    $invoice->status = $totalPaid >= (float) $invoice->total_amount
                        ? 'paid'
                        : ($totalPaid > 0 ? 'partial' : 'unpaid');

                    $invoice->save();
                }
            }

            return $updatedPayment;
        });
    }

    public function delete(SubscriptionPayment $payment): bool
    {
        return $this->repository->delete($payment);
    }
}
