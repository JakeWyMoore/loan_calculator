'use client'
import React, { useState } from 'react';
import classes from './LoanCalculator.module.css';

const loanProducts = [
    {
        category: "Auto Loans",
        subItems: [
            { name: "New Car Loan", rate: 5.2 },
            { name: "Used Car Loan", rate: 6.0 },
        ],
    },
    {
        category: "Home Loans",
        subItems: [
            { name: "Conventional Loans", rate: 4.5 },
            { name: "FHA Loans", rate: 3.8 },
            { name: "VA Loans", rate: 3.2 },
        ],
    },
];

const savingsProducts = [
    {
        category: "Savings Accounts",
        subItems: [
            { name: "High Yield Savings", rate: 2.5 },
            { name: "Certificate of Deposit (CD)", rate: 3.0 },
        ],
    },
    {
        category: "Retirement Accounts",
        subItems: [
            { name: "IRA", rate: 4.0 },
            { name: "401(k)", rate: 5.5 },
        ],
    },
];


export function Calculator() {
    const [isLoanCalculator, setIsLoanCalculator] = useState(true);
    const [loanInterestRate, setLoanInterestRate] = useState(0);
    const [savingsInterestRate, setSavingsInterestRate] = useState(0);

    return (
      <div className={classes.mainContainer}>

        <div className={classes.calculatorContainer}>
            <div className={classes.calculatorContainerLeft}>
                <div className={classes.leftHeader}>
                    <h2>Products:</h2>

                    <div className={classes.toggleContainer}>
                        <div className={`${classes.toggleBackground} ${isLoanCalculator ? classes.loanActive : classes.savingsActive}`}>
                            <div className={classes.toggleSlider}></div>
                        </div>
                        <button className={`${classes.toggleButton} ${isLoanCalculator ? classes.active : ""}`} onClick={() => setIsLoanCalculator(true)}>
                            Loans
                        </button>
                        <button className={`${classes.toggleButton} ${!isLoanCalculator ? classes.active : ""}`} onClick={() => setIsLoanCalculator(false)}>
                            Savings
                        </button>
                    </div>
                </div>

                {isLoanCalculator 
                    ? <LoanTypes setInterestRate={setLoanInterestRate} /> 
                    : <SavingsTypes setInterestRate={setSavingsInterestRate} />}  

            </div>

            {isLoanCalculator 
                ? <LoanCalculator interestRate={loanInterestRate} setInterestRate={setLoanInterestRate} /> 
                : <SavingsCalculator interestRate={savingsInterestRate} setInterestRate={setSavingsInterestRate} />}

        </div>
      </div>

    );
}

function LoanTypes({ setInterestRate }) {
    const [openCategory, setOpenCategory] = useState(null);
    const [activeSubItem, setActiveSubItem] = useState(null);

    return (
        <div className={classes.loanSection}>
            {loanProducts.map((product, index) => (
                <div key={index} className={classes.accordionItem}>
                    <div className={`${classes.accordionHeader} ${openCategory === index ? classes.open : ""}`} onClick={() => setOpenCategory(openCategory === index ? null : index)}>
                        {product.category}
                    </div>
                    <div className={`${classes.accordionContent} ${openCategory === index ? classes.expanded : classes.collapsed}`}>
                        {product.subItems.map((item, idx) => (
                            <div
                                key={idx}
                                className={`${classes.accordionSubitem} ${activeSubItem === item.name ? classes.active : ""}`}
                                onClick={() => {
                                    setInterestRate(item.rate);
                                    setActiveSubItem(item.name);
                                }}
                            >
                                <p>{item.name} ({item.rate}%)</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function SavingsTypes({ setInterestRate }) {
    const [openCategory, setOpenCategory] = useState(null);
    const [activeSubItem, setActiveSubItem] = useState(null);

    return (
        <div className={classes.loanSection}>
            {savingsProducts.map((product, index) => (
                <div key={index} className={classes.accordionItem}>
                    <div className={`${classes.accordionHeader} ${openCategory === index ? classes.open : ""}`} onClick={() => setOpenCategory(openCategory === index ? null : index)}>
                        {product.category}
                    </div>
                    <div className={`${classes.accordionContent} ${openCategory === index ? classes.expanded : classes.collapsed}`}>
                        {product.subItems.map((item, idx) => (
                            <div
                                key={idx}
                                className={`${classes.accordionSubitem} ${activeSubItem === item.name ? classes.active : ""}`}
                                onClick={() => {
                                    setInterestRate(item.rate);
                                    setActiveSubItem(item.name);
                                }}
                            >
                                <p>{item.name} ({item.rate}%)</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

// Loan Calculator Component
function LoanCalculator({ interestRate, setInterestRate }) {
    const [loanAmount, setLoanAmount] = useState(0);
    const [paymentSchedule, setPaymentSchedule] = useState('Monthly');
    const [term, setTerm] = useState(1); // in years

    // Helpers
    const periodsPerYear = { Monthly: 12, Quarterly: 4, Annually: 1 };
    const paymentPeriods = periodsPerYear[paymentSchedule] || 1;
    const periodicInterestRate = interestRate / 100 / paymentPeriods;
    const totalPayments = term * paymentPeriods;

    // Calculate Monthly Payment
    const calculateMonthlyPayment = () => {
        if (periodicInterestRate === 0) return loanAmount / totalPayments;
        return (loanAmount * periodicInterestRate) / (1 - Math.pow(1 + periodicInterestRate, -totalPayments));
    };

    const monthlyPayment = calculateMonthlyPayment();
    const totalPayment = monthlyPayment * totalPayments;
    const totalInterest = totalPayment - loanAmount;

    // Calculate Monthly Interest (First Payment)
    const monthlyInterest = loanAmount * periodicInterestRate;
    const principalPercentage = (loanAmount / totalPayment) * 100 || 0;
    const interestPercentage = (totalInterest / totalPayment) * 100 || 0;

    return (
        <div className={classes.calculator}>
            <div className={classes.calculatorContent}>                

                {/* Right Side - Loan Form */}
                <div className={classes.calculatorForm}>
                    <div className={classes.inputGroup}>
                        <label>Loan Amount</label>
                        <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)} />
                    </div>
                    <div className={classes.inputGroup}>
                        <label>Payment Schedule</label>
                        <select value={paymentSchedule} onChange={(e) => setPaymentSchedule(e.target.value)}>
                            <option value="Monthly">Monthly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Annually">Annually</option>
                        </select>
                    </div>
                    <div className={classes.inputGroup}>
                        <label>Loan Term (Years)</label>
                        <input type="number" value={term} onChange={(e) => setTerm(parseInt(e.target.value) || 1)} />
                    </div>
                    <div className={classes.inputGroup}>
                        <label>Interest Rate (%)</label>
                        <input type="number" value={interestRate} onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)} />
                    </div>
                </div>

                {/* Results and Bar */}
                <div className={classes.calculatorRight}>
                    <p>Viewing as {paymentSchedule} Payments</p>
                    <h2>${loanAmount.toFixed(2)}</h2>
                    <div className={classes.barContainer}>
                        <div className={classes.barPrincipal} style={{ width: `${principalPercentage}%` }}></div>
                        <div className={classes.barInterest} style={{ width: `${interestPercentage}%` }}></div>
                    </div>

                    <div className={classes.breakdownCostsLoans}>
                        <div className={classes.costGroup}>
                            <p><strong>{principalPercentage.toFixed(0)}% Principal</strong></p>
                            <p>{monthlyPayment.toFixed(2)} /mo</p>
                            <p>${loanAmount.toFixed(2)} total</p>
                        </div>
                        <div className={classes.costGroup}>
                            <p><strong>{interestPercentage.toFixed(0)}% Interest</strong></p>
                            <p>{monthlyInterest.toFixed(2)} /mo</p>
                            <p>${totalInterest.toFixed(2)} total</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Savings Calculator Component
function SavingsCalculator({ interestRate, setInterestRate }) {
    const [initialSavings, setInitialSavings] = useState(0);
    const [monthlyContribution, setMonthlyContribution] = useState(0);
    const [term, setTerm] = useState(1); // in years

    // Helpers
    const paymentSchedule = 12; // Monthly contributions
    const totalMonths = term * paymentSchedule;
    const monthlyInterestRate = interestRate / 100 / paymentSchedule;

    // Calculate Total Savings and Interest
    const calculateSavings = () => {
        let totalSaved = initialSavings;
        let totalInterest = 0;

        for (let i = 0; i < totalMonths; i++) {
            const interest = totalSaved * monthlyInterestRate; // Earned interest
            totalSaved += interest + monthlyContribution; // Add interest and new contribution
            totalInterest += interest; // Track total interest earned
        }

        return { totalSaved, totalInterest };
    };

    const { totalSaved, totalInterest } = calculateSavings();
    const totalContributions = monthlyContribution * totalMonths;

    // Percentages for visualization
    const initialSavingsPercentage = totalSaved > 0 ? (initialSavings / totalSaved) * 100 : 0;
    const contributionPercentage = totalSaved > 0 ? (totalContributions / totalSaved) * 100 : 0;
    const interestPercentage = totalSaved > 0 ? (totalInterest / totalSaved) * 100 : 0;

    return (
        <div className={classes.calculator}>
            <div className={classes.calculatorContent}>

                {/* Form */}
                <div className={classes.calculatorForm}>
                    <div className={classes.inputGroup}>
                        <label>Initial Savings</label>
                        <input type="number" value={initialSavings} onChange={(e) => setInitialSavings(parseFloat(e.target.value) || 0)} />
                    </div>
                    <div className={classes.inputGroup}>
                        <label>Monthly Contribution</label>
                        <input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 0)} />
                    </div>
                    <div className={classes.inputGroup}>
                        <label>Term (Years)</label>
                        <input type="number" value={term} onChange={(e) => setTerm(parseInt(e.target.value) || 1)} />
                    </div>
                    <div className={classes.inputGroup}>
                        <label>APY (%)</label>
                        <input type="number" value={interestRate} onChange={(e) => setInterestRate(parseInt(e.target.value) || 0)} />                    </div>
                </div>

                {/* Results and Bar */}
                <div className={classes.calculatorRight}>
                    <p>Viewing as Total Earnings</p>
                    <h2>${totalSaved.toFixed(2)}</h2>
                    <div className={classes.barContainer}>
                        <div className={classes.barInitial} style={{ width: `${initialSavingsPercentage}%` }} ></div>
                        <div className={classes.barContributions} style={{ width: `${contributionPercentage}%` }}></div>
                        <div className={classes.barAPY} style={{ width: `${interestPercentage}%` }}></div>
                    </div>

                    <div className={classes.breakdownCostsSavings}>
                        <div className={classes.costGroup}>
                            <h4 className={classes.initialDeposit}>Initial Deposit:</h4>
                            <p>${initialSavings.toFixed(2)}</p>
                        </div>
                        <div className={classes.costGroup}>
                            <h4 className={classes.additionalContributions}>Additional Contributions:</h4>
                            <p>${totalContributions.toFixed(2)}</p>
                        </div>
                        <div className={classes.costGroup}>
                            <h4 className={classes.interestEarned}>Interest Earned:</h4>
                            <p>${totalInterest.toFixed(2)}</p> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

