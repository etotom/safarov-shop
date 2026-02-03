'use client'

import { useState, useEffect } from 'react'
import { convertCurrency, formatCurrency, getAvailableCurrencies } from '@/lib/currency'

interface CurrencyConverterProps {
  amount: number
  baseCurrency?: string
}

export default function CurrencyConverter({ amount, baseCurrency = 'USD' }: CurrencyConverterProps) {
  const [selectedCurrency, setSelectedCurrency] = useState(baseCurrency)
  const [convertedAmount, setConvertedAmount] = useState(amount)

  useEffect(() => {
    if (selectedCurrency === baseCurrency) {
      setConvertedAmount(amount)
    } else {
      const converted = convertCurrency(amount, baseCurrency, selectedCurrency)
      setConvertedAmount(converted)
    }
  }, [amount, baseCurrency, selectedCurrency])

  const currencies = getAvailableCurrencies()

  return (
    <div className="flex items-center space-x-2">
      <select
        value={selectedCurrency}
        onChange={(e) => setSelectedCurrency(e.target.value)}
        className="text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-1 rounded font-light"
      >
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
      <span className="text-gray-900 dark:text-gray-100 font-light">
        {formatCurrency(convertedAmount, selectedCurrency)}
      </span>
    </div>
  )
}
