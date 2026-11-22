<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Accounting\JournalEntryRequest;
use App\Models\JournalEntry;
use App\Models\JournalItem; 
use App\Models\Account;
use App\Services\JournalEntryService;
use Illuminate\Support\Facades\DB; 
use Inertia\Inertia;

class JournalEntryController extends Controller
{
    public function __construct(protected JournalEntryService $service) {}



    public function index(){
        return Inertia::render('Accounting/JournalEntries/Index', [
            'journalEntries' => $this->service->getAll(),
            'accounts' => Account::where('status', 'active')->get(['id', 'name', 'code', 'type']),
        ]);
    }

    public function store(JournalEntryRequest $request){
        $this->service->create($request->validated());
        return back()->with('success', 'Journal entry created successfully.');
    }


    public function update(JournalEntryRequest $request, JournalEntry $journalEntry){
        try {
            $this->service->update($journalEntry, $request->validated());
            return back()->with('success', 'Journal entry updated successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }


    public function destroy(JournalEntry $journalEntry){
        try {
            $this->service->delete($journalEntry);
            return back()->with('success', 'Journal entry deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }


    public function post(JournalEntry $journalEntry){
        try {
            $this->service->post($journalEntry);
            return back()->with('success', 'Journal entry posted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }


    public function cancel(JournalEntry $journalEntry){
        try {
            $this->service->cancel($journalEntry);
            return back()->with('success', 'Journal entry cancelled successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }



    public function trialBalance(){
        $balances = JournalItem::select(
                'account_id',
                DB::raw('SUM(debit) as total_debit'),
                DB::raw('SUM(credit) as total_credit')
            )
            ->whereHas('journalEntry', function ($query) {
                $query->where('status', 'posted');
            })
            ->groupBy('account_id')
            ->with('account:id,code,name,type')
            ->get();

        $formattedData = [];
        $grandTotalDebit = 0;
        $grandTotalCredit = 0;

        foreach ($balances as $balance) {
            $debit = (float) $balance->total_debit;
            $credit = (float) $balance->total_credit;
            
            $netDebit = 0;
            $netCredit = 0;

            if (in_array($balance->account->type, ['asset', 'expense'])) {
                $netBalance = $debit - $credit;
                if ($netBalance > 0) $netDebit = $netBalance;
                else $netCredit = abs($netBalance);
            } 

            else {
                $netBalance = $credit - $debit;
                if ($netBalance > 0) $netCredit = $netBalance;
                else $netDebit = abs($netBalance);
            }


            if ($netDebit == 0 && $netCredit == 0) {
                continue;
            }

            $formattedData[] = [
                'code' => $balance->account->code,
                'name' => $balance->account->name,
                'type' => $balance->account->type,
                'debit' => $netDebit,
                'credit' => $netCredit,
            ];

            $grandTotalDebit += $netDebit;
            $grandTotalCredit += $netCredit;
        }


        usort($formattedData, function ($a, $b) {
            return strcmp($a['code'], $b['code']);
        });

        return Inertia::render('Accounting/Reports/TrialBalance', [
            'reportData' => $formattedData,
            'grandTotalDebit' => round($grandTotalDebit, 2),
            'grandTotalCredit' => round($grandTotalCredit, 2),
        ]);
    }





    
    public function profitLoss(){
        $balances = $this->getAccountBalances();
        $reportData = ['income' => [], 'expense' => []];
        $totalIncome = 0;
        $totalExpense = 0;

        foreach ($balances as $b) {
            $net = 0;
            if ($b->account->type === 'income') {
                $net = $b->total_credit - $b->total_debit;
                if ($net != 0) {
                    $reportData['income'][] = ['code' => $b->account->code, 'name' => $b->account->name, 'amount' => $net];
                    $totalIncome += $net;
                }
            } elseif ($b->account->type === 'expense') {
                $net = $b->total_debit - $b->total_credit; 
                if ($net != 0) {
                    $reportData['expense'][] = ['code' => $b->account->code, 'name' => $b->account->name, 'amount' => $net];
                    $totalExpense += $net;
                }
            }
        }

        $netProfit = $totalIncome - $totalExpense;

        return Inertia::render('Accounting/Reports/ProfitLoss', [
            'reportData' => $reportData,
            'totalIncome' => round($totalIncome, 2),
            'totalExpense' => round($totalExpense, 2),
            'netProfit' => round($netProfit, 2),
        ]);
    }

    public function balanceSheet(){
        $balances = $this->getAccountBalances();
        $reportData = ['asset' => [], 'liability' => [], 'equity' => []];
        $totalAsset = 0;
        $totalLiabilityEquity = 0;


        $netProfit = 0;
        foreach ($balances as $b) {
            if ($b->account->type === 'income') $netProfit += ($b->total_credit - $b->total_debit);
            elseif ($b->account->type === 'expense') $netProfit -= ($b->total_debit - $b->total_credit);
        }

        foreach ($balances as $b) {
            $net = 0;
            if ($b->account->type === 'asset') {
                $net = $b->total_debit - $b->total_credit;
                if ($net != 0) {
                    $reportData['asset'][] = ['code' => $b->account->code, 'name' => $b->account->name, 'amount' => $net];
                    $totalAsset += $net;
                }
            } elseif (in_array($b->account->type, ['liability', 'equity'])) {
                $net = $b->total_credit - $b->total_debit;
                if ($net != 0) {
                    $reportData[$b->account->type][] = ['code' => $b->account->code, 'name' => $b->account->name, 'amount' => $net];
                    $totalLiabilityEquity += $net;
                }
            }
        }

        if ($netProfit != 0) {
            $reportData['equity'][] = ['code' => 'NP', 'name' => 'Net Profit / (Loss) for the period', 'amount' => $netProfit];
            $totalLiabilityEquity += $netProfit;
        }

        return Inertia::render('Accounting/Reports/BalanceSheet', [
            'reportData' => $reportData,
            'totalAsset' => round($totalAsset, 2),
            'totalLiabilityEquity' => round($totalLiabilityEquity, 2),
        ]);
    }


    public function generalLedger(\Illuminate\Http\Request $request){
        $query = \App\Models\JournalItem::with([
            'journalEntry:id,reference_no,entry_date,status', 
            'account:id,code,name'
        ])->whereHas('journalEntry', fn($q) => $q->where('status', 'posted'));

        if ($request->account_id) {
            $query->where('account_id', $request->account_id);
        }
        if ($request->start_date) {
            $query->whereHas('journalEntry', fn($q) => $q->where('entry_date', '>=', $request->start_date));
        }
        if ($request->end_date) {
            $query->whereHas('journalEntry', fn($q) => $q->where('entry_date', '<=', $request->end_date));
        }

        $ledgerItems = $query->orderBy('entry_date', 'asc')->orderBy('id', 'asc')->get();
        
      
        $runningBalance = 0;
        foreach ($ledgerItems as $item) {
            if ($item->account && in_array($item->account->type, ['asset', 'expense'])) {
                $runningBalance += ($item->debit - $item->credit);
            } else {
                $runningBalance += ($item->credit - $item->debit);
            }
            $item->running_balance = $runningBalance;
        }

        return Inertia::render('Accounting/Reports/GeneralLedger', [
            'ledgerItems' => $ledgerItems,
            'accounts' => \App\Models\Account::where('status', 'active')->orderBy('code')->get(['id', 'code', 'name']),
            'filters' => $request->only(['account_id', 'start_date', 'end_date']),
        ]);
    }


    private function getAccountBalances(){
        return \App\Models\JournalItem::select(
                'account_id',
                \Illuminate\Support\Facades\DB::raw('SUM(debit) as total_debit'),
                \Illuminate\Support\Facades\DB::raw('SUM(credit) as total_credit')
            )
            ->whereHas('journalEntry', function ($query) {
                $query->where('status', 'posted');
            })
            ->groupBy('account_id')
            ->with('account:id,code,name,type')
            ->get();
    }
}