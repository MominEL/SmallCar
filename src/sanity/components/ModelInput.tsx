import { useCallback, useEffect, useState } from 'react'
import { TextInput, Stack, Text } from '@sanity/ui'
import { StringInputProps, set, unset, useFormValue } from 'sanity'

export function ModelInput(props: StringInputProps) {
  const { value, onChange, path } = props
  
  // Get the 'make' value from the current document
  const makePath = [...path.slice(0, -1), 'make']
  const customMakePath = [...path.slice(0, -1), 'customMake']
  
  const make = useFormValue(makePath) as string
  const customMake = useFormValue(customMakePath) as string
  
  const actualMake = make === 'Other' ? customMake : make

  const [models, setModels] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!actualMake) {
      setModels([])
      return
    }

    let isMounted = true
    setLoading(true)
    
    // Fetch from free NHTSA API
    fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${encodeURIComponent(actualMake)}?format=json`)
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.Results) {
          const fetchedModels = data.Results.map((r: any) => r.Model_Name)
          // Filter duplicates and sort
          setModels(Array.from(new Set(fetchedModels)).sort() as string[])
        }
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [actualMake])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.currentTarget.value
      onChange(nextValue ? set(nextValue) : unset())
    },
    [onChange]
  )

  const datalistId = `models-list-${path.join('-')}`

  return (
    <Stack space={2}>
      <TextInput
        value={value || ''}
        onChange={handleChange}
        list={datalistId}
        placeholder={loading ? `Loading models for ${actualMake}...` : "Select or type a model"}
      />
      <datalist id={datalistId}>
        {models.map((model) => (
          <option key={model} value={model} />
        ))}
      </datalist>
      {loading && <Text size={1} muted>Fetching models from database...</Text>}
    </Stack>
  )
}
