<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {{ t('tools.creditCardGenerator') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ t('creditCardGenerator.description') }}
      </p>
    </div>

    <!-- Configuration -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {{ t('creditCardGenerator.configuration') }}
      </h3>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Brand Selection -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {{ t('creditCardGenerator.selectBrands') }}
            </label>
            <div class="grid grid-cols-2 gap-3">
              <label
                v-for="brand in availableBrands"
                :key="brand.name"
                class="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                :class="{ 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600': selectedBrands.includes(brand.name) }"
              >
                <input
                  v-model="selectedBrands"
                  type="checkbox"
                  :value="brand.name"
                  class="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  @change="generateCards"
                />
                <div class="flex items-center space-x-2">
                  <component :is="getBrandIcon(brand.name)" class="w-5 h-5" />
                  <span class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ brand.displayName }}
                  </span>
                </div>
              </label>
            </div>
            
            <!-- Quick Select Buttons -->
            <div class="flex space-x-2 mt-3">
              <button
                @click="selectAll"
                class="btn btn-ghost text-xs"
              >
                {{ t('creditCardGenerator.selectAll') }}
              </button>
              <button
                @click="selectNone"
                class="btn btn-ghost text-xs"
              >
                {{ t('creditCardGenerator.selectNone') }}
              </button>
              <button
                @click="selectDefault"
                class="btn btn-ghost text-xs"
              >
                {{ t('creditCardGenerator.selectDefault') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Generation Settings -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('creditCardGenerator.countPerBrand') }}
            </label>
            <input
              v-model.number="countPerBrand"
              type="number"
              min="1"
              max="50"
              class="input w-full"
              @input="generateCards"
            />
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ t('creditCardGenerator.maxCards', { max: 50 }) }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ t('creditCardGenerator.outputFormat') }}
            </label>
            <select
              v-model="outputFormat"
              class="input w-full"
              @change="updateDisplayedCards"
            >
              <option value="formatted">{{ t('creditCardGenerator.formats.formatted') }}</option>
              <option value="numbers">{{ t('creditCardGenerator.formats.numbersOnly') }}</option>
              <option value="detailed">{{ t('creditCardGenerator.formats.detailed') }}</option>
              <option value="json">{{ t('creditCardGenerator.formats.json') }}</option>
              <option value="csv">{{ t('creditCardGenerator.formats.csv') }}</option>
            </select>
          </div>

          <!-- Quick Actions -->
          <div class="flex space-x-3">
            <button
              @click="generateCards"
              class="btn btn-primary flex-1"
              :disabled="selectedBrands.length === 0"
            >
              <CreditCardIcon class="w-4 h-4 mr-2" />
              {{ t('creditCardGenerator.generate') }}
            </button>
            
            <button
              @click="clearResults"
              class="btn btn-ghost"
              :disabled="generatedCards.length === 0"
            >
              <TrashIcon class="w-4 h-4 mr-1" />
              {{ t('common.clear') }}
            </button>
          </div>
        </div>
      </div>
    </div>



    <!-- Generated Results -->
    <div v-if="generatedCards.length > 0" class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ t('creditCardGenerator.generatedCards') }}
      </h3>
      
      <!-- Results by Brand -->
      <div v-if="outputFormat === 'detailed'" class="space-y-3">
        <div
          v-for="brandGroup in groupedCards"
          :key="brandGroup.brand"
          class="card p-3"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center space-x-2">
              <component :is="getBrandIcon(brandGroup.brand)" class="w-4 h-4" />
              <h4 class="font-semibold text-gray-900 dark:text-white text-sm">
                {{ brandGroup.displayName }}
              </h4>
              <span class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                {{ brandGroup.cards.length }} {{ t('creditCardGenerator.cards') }}
              </span>
            </div>
            <button
              @click="copyBrandCards(brandGroup.brand)"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xs flex items-center space-x-1"
            >
              <ClipboardDocumentIcon class="w-3 h-3" />
              <span>{{ t('common.copy') }}</span>
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
              v-for="(card, index) in brandGroup.cards"
              :key="index"
              class="bg-gray-50 dark:bg-gray-800 rounded-md p-3 border-l-4"
              :class="getBrandColorClass(brandGroup.brand)"
            >
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center space-x-2 min-w-0 flex-1">
                  <component :is="getBrandIcon(brandGroup.brand)" class="w-4 h-4 flex-shrink-0" />
                  <div class="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {{ card.displayName }}
                  </div>
                </div>
                <button
                  @click="copyToClipboard(card.number)"
                  class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                  :title="t('common.copy')"
                >
                  <ClipboardDocumentIcon class="w-4 h-4" />
                </button>
              </div>
              <div class="font-bold text-sm font-mono text-gray-900 dark:text-white mb-2">
                {{ formatCardNumber(card.number) }}
              </div>
              <div class="text-xs text-gray-600 dark:text-gray-400 font-mono">
                <div>CVV: {{ card.cvv }}</div>
                <div>有效期: {{ card.expiryDate }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Single Output Block -->
      <div v-else>
        <CodeBlock
          :content="displayedContent"
          :language="getLanguageForFormat()"
          :title="getFormatTitle()"
          height="lg"
          :show-copy="true"
          :show-copy-text="true"
          :show-stats="true"
          :copy-success-message="t('creditCardGenerator.copiedCards')"
        />
      </div>
    </div>

    <!-- Usage Examples -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {{ t('creditCardGenerator.usageExamples') }}
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="example in examples"
          :key="example.title"
          class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          @click="loadExample(example)"
        >
          <h4 class="font-medium text-gray-900 dark:text-white mb-2">{{ example.title }}</h4>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ example.description }}</p>
          <div class="flex items-center space-x-2">
            <div
              v-for="brand in example.brands"
              :key="brand"
              class="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
            >
              <component :is="getBrandIcon(brand)" class="w-3 h-3" />
              <span>{{ CARD_BRANDS[brand]?.displayName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCopyToClipboard } from '@/composables/useCopyToClipboard'
import CodeBlock from '@/components/common/CodeBlock.vue'
import {
  CARD_BRANDS,
  generateMultipleCreditCards,
  formatCardNumber as formatCardNum,
  type CardBrand
} from '@/utils/creditCard'
import {
  CreditCardIcon,
  TrashIcon,
  ClipboardDocumentIcon,
  BanknotesIcon,
  CircleStackIcon,
  IdentificationIcon,
  GlobeAsiaAustraliaIcon
} from '@heroicons/vue/24/outline'

// Composables
const { t } = useI18n()
const { copyToClipboard } = useCopyToClipboard()

// Types
interface GeneratedCard {
  number: string
  brand: string
  displayName: string
  cvv: string
  expiryDate: string
}

// State
const selectedBrands = ref<string[]>(['visa', 'mastercard', 'jcb', 'discover'])
const countPerBrand = ref(5)
const outputFormat = ref('detailed')
const generatedCards = ref<GeneratedCard[]>([])

// Available brands
const availableBrands = computed(() => Object.values(CARD_BRANDS))

// Grouped cards by brand
const groupedCards = computed(() => {
  const groups: Record<string, GeneratedCard[]> = {}
  
  generatedCards.value.forEach(card => {
    if (!groups[card.brand]) {
      groups[card.brand] = []
    }
    groups[card.brand].push(card)
  })
  
  return Object.entries(groups).map(([brand, cards]) => ({
    brand,
    displayName: cards[0]?.displayName || brand,
    cards
  }))
})

// Displayed content based on format
const displayedContent = computed(() => {
  if (generatedCards.value.length === 0) return ''
  
  switch (outputFormat.value) {
    case 'formatted':
      return generatedCards.value
        .map(card => formatCardNum(card.number))
        .join('\n')
        
    case 'numbers':
      return generatedCards.value
        .map(card => card.number)
        .join('\n')
        
    case 'json':
      return JSON.stringify(generatedCards.value, null, 2)
        
    case 'csv':
      const headers = 'Number,Brand,CVV,Expiry'
      const rows = generatedCards.value.map(card => 
        `${card.number},${card.displayName},${card.cvv},${card.expiryDate}`
      )
      return [headers, ...rows].join('\n')
        
    default:
      return generatedCards.value
        .map(card => `${formatCardNum(card.number)} | ${card.displayName} | CVV: ${card.cvv} | Exp: ${card.expiryDate}`)
        .join('\n')
  }
})

// Examples
const examples = [
  {
    title: t('creditCardGenerator.examples.testing.title', 'Payment Testing'),
    description: t('creditCardGenerator.examples.testing.desc', 'Common brands for payment gateway testing'),
    brands: ['visa', 'mastercard', 'amex']
  },
  {
    title: t('creditCardGenerator.examples.global.title', 'Global Brands'),
    description: t('creditCardGenerator.examples.global.desc', 'Worldwide accepted credit cards'),
    brands: ['visa', 'mastercard', 'jcb', 'discover']
  },
  {
    title: t('creditCardGenerator.examples.regional.title', 'Regional Cards'),
    description: t('creditCardGenerator.examples.regional.desc', 'Regional and specialized cards'),
    brands: ['unionpay', 'diners', 'jcb']
  },
  {
    title: t('creditCardGenerator.examples.premium.title', 'Premium Cards'),
    description: t('creditCardGenerator.examples.premium.desc', 'Premium and business cards'),
    brands: ['amex', 'diners']
  }
]

// Methods
const generateCards = () => {
  if (selectedBrands.value.length === 0 || countPerBrand.value <= 0) {
    generatedCards.value = []
    return
  }
  
  generatedCards.value = generateMultipleCreditCards(
    selectedBrands.value,
    Math.min(countPerBrand.value, 50)
  )
}

const selectAll = () => {
  selectedBrands.value = availableBrands.value.map(b => b.name)
  generateCards()
}

const selectNone = () => {
  selectedBrands.value = []
  generatedCards.value = []
}

const selectDefault = () => {
  selectedBrands.value = ['visa', 'mastercard', 'jcb', 'discover']
  generateCards()
}

const clearResults = () => {
  generatedCards.value = []
}

const updateDisplayedCards = () => {
  // Trigger reactivity for computed content
}

const formatCardNumber = (number: string) => formatCardNum(number)

const getLanguageForFormat = () => {
  switch (outputFormat.value) {
    case 'json': return 'json'
    case 'csv': return 'csv'
    default: return 'text'
  }
}

const getFormatTitle = () => {
  switch (outputFormat.value) {
    case 'formatted': return t('creditCardGenerator.formats.formatted')
    case 'numbers': return t('creditCardGenerator.formats.numbersOnly')
    case 'json': return t('creditCardGenerator.formats.json')
    case 'csv': return t('creditCardGenerator.formats.csv')
    default: return t('creditCardGenerator.formats.detailed')
  }
}

const getBrandIcon = (brand: string) => {
  const icons: Record<string, any> = {
    visa: CreditCardIcon,
    mastercard: CreditCardIcon,
    jcb: CircleStackIcon,
    discover: IdentificationIcon,
    amex: BanknotesIcon,
    diners: BanknotesIcon,
    unionpay: GlobeAsiaAustraliaIcon
  }
  return icons[brand] || CreditCardIcon
}

const getBrandColorClass = (brand: string) => {
  const colors: Record<string, string> = {
    visa: 'border-l-blue-500',
    mastercard: 'border-l-red-500',
    jcb: 'border-l-green-500',
    discover: 'border-l-orange-500',
    amex: 'border-l-purple-500',
    diners: 'border-l-pink-500',
    unionpay: 'border-l-yellow-500'
  }
  return colors[brand] || 'border-l-gray-500'
}

const copyBrandCards = async (brand: string) => {
  const brandCards = generatedCards.value.filter(card => card.brand === brand)
  const content = brandCards.map(card => formatCardNum(card.number)).join('\n')
  await copyToClipboard(content, t('creditCardGenerator.brandCardsCopied', { brand: brandCards[0]?.displayName }))
}

const loadExample = (example: any) => {
  selectedBrands.value = example.brands
  generateCards()
}

// Initialize
onMounted(() => {
  generateCards()
})
</script>

<style scoped>
/* Component-specific styles */
</style> 