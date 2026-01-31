<script setup lang="ts">
import { computed } from 'vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

/**
 * Props:
 * - modelValue: قيمة الـ v-model (String | Number | Object)
 * - options: مصفوفة العناصر (كل عنصر يكون object أو قيمة بسيطة)
 * - placeholder: نص افتراضي
 */
const props = defineProps({
  modelValue: {
    type: [String, Number, Object, null],
    default: null,
  },
  options: {
    type: Array as () => Array<any>,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Select a fruit',
  },
  // optional: اسم الحقل الذي يحتوي القيمة داخل العنصر (مثلاً 'value' أو 'id')
  valueKey: {
    type: String,
    default: 'value',
  },
})

const emit = defineEmits(['update:modelValue'])

// computed getter/setter يربط الـ Select مع v-model في الأب
const localValue = computed({
  get() {
    return props.modelValue
  },
  set(v) {
    emit('update:modelValue', v)
  },
})

/**
 * مساعدة لاستخراج القيمة من option:
 * إذا option object حاول قراءة props.valueKey وإلا ارجع option نفسه
 */
const getOptionValue = (option: any) => {
  if (option == null) return option
  if (typeof option === 'object') {
    return option[props.valueKey] ?? option
  }
  return option
}

/**
 * مساعدة لاستخراج نص العرض للاوبشن داخل السطر الافتراضي (اذا لم تستخدم slot)
 */
const getOptionLabel = (option: any) => {
  if (option == null) return ''
  if (typeof option === 'object') {
    return option.ar_name ?? option.en_name ?? option.name ?? String(option[props.valueKey] ?? option)
  }
  return String(option)
}

// استنتاج العنصر المختار حالياً من القائمة لعرضه في الـ Trigger
const selectedOption = computed(() => {
  return props.options.find((option) => getOptionValue(option) === localValue.value)
})
</script>

<template>
  <!-- اربط Select بالـ localValue ليعمل v-model -->
  <Select v-model="localValue">
    <SelectTrigger class="w-[180px]">
      <!-- عرض مخصص للنص المختار في الـ Trigger -->
      <template v-if="selectedOption">
        <slot name="selected" :option="selectedOption">
          {{ getOptionLabel(selectedOption) }}
        </slot>
      </template>
      <span v-else class="text-muted-foreground">
        {{ placeholder }}
      </span>
    </SelectTrigger>

    <SelectContent>
      <SelectGroup>
        <SelectLabel>{{ placeholder }}</SelectLabel>

        <!-- افترض أن options مصفوفة -->
        <SelectItem
          v-for="(option, idx) in options"
          :key="option?.id ?? option?.value ?? idx"
          :value="getOptionValue(option)"
        >
          <!-- إذا المستخدم أعطى slot اسمه option استخدمه وإلا اعرض النص الافتراضي -->
          <slot name="option" :option="option">
            {{ getOptionLabel(option) }}
          </slot>
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
