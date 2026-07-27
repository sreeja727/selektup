import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from '@chakra-ui/react'

// eslint-disable-next-line react-refresh/only-export-components -- shared toaster instance, not a component
export const toaster = createToaster({
  placement: 'top-end',
  pauseOnPageIdle: true,
})

export function Toaster() {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: '4' }}>
        {(toast) => (
          <Toast.Root
            width={{ md: 'sm' }}
            borderRadius="lg"
            boxShadow="0 8px 28px rgba(12,18,34,0.18)"
          >
            {toast.type === 'loading' ? (
              <Spinner size="sm" color="#039BE5" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            {toast.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}
