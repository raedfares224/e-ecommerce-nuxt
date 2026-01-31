export const useOrderSuccess = () => {
  const lastOrderData = useState<any>('lastOrderData', () => null)
  
  const setOrderData = (data: any) => {
    lastOrderData.value = data
  }

  const clearOrderData = () => {
    lastOrderData.value = null
  }

  return {
    lastOrderData,
    setOrderData,
    clearOrderData
  }
}
