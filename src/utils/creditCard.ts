/**
 * 信用卡号生成工具类
 * 支持多种主流信用卡品牌的有效号码生成
 */

// 信用卡品牌配置
export interface CardBrand {
  name: string
  displayName: string
  prefixes: string[]
  length: number[]
  cvvLength: number
}

// 支持的信用卡品牌
export const CARD_BRANDS: Record<string, CardBrand> = {
  visa: {
    name: 'visa',
    displayName: 'Visa',
    prefixes: ['4'],
    length: [16],
    cvvLength: 3
  },
  mastercard: {
    name: 'mastercard',
    displayName: 'MasterCard',
    prefixes: ['5', '2221', '2222', '2223', '2224', '2225', '2226', '2227', '2228', '2229', '223', '224', '225', '226', '227', '228', '229', '23', '24', '25', '26', '270', '271', '2720'],
    length: [16],
    cvvLength: 3
  },
  jcb: {
    name: 'jcb',
    displayName: 'JCB',
    prefixes: ['35'],
    length: [16],
    cvvLength: 3
  },
  discover: {
    name: 'discover',
    displayName: 'Discover',
    prefixes: ['6011', '622', '64', '65'],
    length: [16],
    cvvLength: 3
  },
  amex: {
    name: 'amex',
    displayName: 'American Express',
    prefixes: ['34', '37'],
    length: [15],
    cvvLength: 4
  },
  diners: {
    name: 'diners',
    displayName: 'Diners Club',
    prefixes: ['30', '36', '38'],
    length: [14],
    cvvLength: 3
  },
  unionpay: {
    name: 'unionpay',
    displayName: 'UnionPay',
    prefixes: ['62'],
    length: [16, 17, 18, 19],
    cvvLength: 3
  }
}

/**
 * Luhn算法 - 计算校验位
 * @param cardNumber 不包含校验位的卡号
 * @returns 校验位数字
 */
export function calculateLuhnCheckDigit(cardNumber: string): number {
  const digits = cardNumber.split('').map(Number).reverse()
  let sum = 0

  for (let i = 0; i < digits.length; i++) {
    let digit = digits[i]
    
    // 对偶数位置（从右往左，0-indexed）的数字乘以2
    if (i % 2 === 1) {
      digit *= 2
      // 如果结果大于9，则减去9
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
  }

  // 校验位是使总和成为10的倍数的数字
  return (10 - (sum % 10)) % 10
}

/**
 * 验证信用卡号是否符合Luhn算法
 * @param cardNumber 完整的信用卡号
 * @returns 是否有效
 */
export function validateLuhn(cardNumber: string): boolean {
  if (!cardNumber || cardNumber.length < 2) return false
  
  const digits = cardNumber.split('').map(Number).reverse()
  let sum = 0

  for (let i = 0; i < digits.length; i++) {
    let digit = digits[i]
    
    if (i % 2 === 1) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
  }

  return sum % 10 === 0
}

/**
 * 生成随机数字字符串
 * @param length 长度
 * @returns 数字字符串
 */
function generateRandomDigits(length: number): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString()
  }
  return result
}

/**
 * 生成单个信用卡号
 * @param brand 信用卡品牌
 * @returns 信用卡号对象
 */
export function generateCreditCard(brand: CardBrand): {
  number: string
  brand: string
  displayName: string
  cvv: string
  expiryDate: string
} {
  // 随机选择一个前缀
  const prefix = brand.prefixes[Math.floor(Math.random() * brand.prefixes.length)]
  
  // 随机选择一个长度
  const length = brand.length[Math.floor(Math.random() * brand.length.length)]
  
  // 生成卡号主体（不包含校验位）
  const remainingLength = length - prefix.length - 1 // -1 for check digit
  const randomDigits = generateRandomDigits(remainingLength)
  const cardNumberWithoutCheck = prefix + randomDigits
  
  // 计算校验位
  const checkDigit = calculateLuhnCheckDigit(cardNumberWithoutCheck)
  const fullCardNumber = cardNumberWithoutCheck + checkDigit.toString()
  
  // 生成CVV
  const cvv = generateRandomDigits(brand.cvvLength)
  
  // 生成未来的过期日期
  const currentDate = new Date()
  const futureYear = currentDate.getFullYear() + Math.floor(Math.random() * 5) + 1 // 1-5年后
  const futureMonth = Math.floor(Math.random() * 12) + 1 // 1-12月
  const expiryDate = `${futureMonth.toString().padStart(2, '0')}/${futureYear.toString().slice(-2)}`
  
  return {
    number: fullCardNumber,
    brand: brand.name,
    displayName: brand.displayName,
    cvv,
    expiryDate
  }
}

/**
 * 批量生成信用卡号
 * @param selectedBrands 选中的品牌名称数组
 * @param count 每个品牌生成的数量
 * @returns 生成的信用卡数组
 */
export function generateMultipleCreditCards(
  selectedBrands: string[], 
  count: number
): Array<{
  number: string
  brand: string
  displayName: string
  cvv: string
  expiryDate: string
}> {
  const results: Array<{
    number: string
    brand: string
    displayName: string
    cvv: string
    expiryDate: string
  }> = []

  selectedBrands.forEach(brandName => {
    const brand = CARD_BRANDS[brandName]
    if (brand) {
      for (let i = 0; i < count; i++) {
        results.push(generateCreditCard(brand))
      }
    }
  })

  return results
}

/**
 * 格式化信用卡号显示（添加空格分隔）
 * @param cardNumber 信用卡号
 * @returns 格式化后的号码
 */
export function formatCardNumber(cardNumber: string): string {
  return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ')
}

/**
 * 检测信用卡品牌
 * @param cardNumber 信用卡号
 * @returns 品牌信息或null
 */
export function detectCardBrand(cardNumber: string): CardBrand | null {
  const cleanNumber = cardNumber.replace(/\s/g, '')
  
  for (const brand of Object.values(CARD_BRANDS)) {
    for (const prefix of brand.prefixes) {
      if (cleanNumber.startsWith(prefix)) {
        return brand
      }
    }
  }
  
  return null
} 