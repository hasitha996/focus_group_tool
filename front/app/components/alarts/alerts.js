import { toast } from 'react-hot-toast'

const alertSettings = {
  duration: 5000,
  position: 'top-right',
  style: {
    background: 'dark',
  },
}

const showToast = (type, msg) => {
  toast[type](msg, { duration: null, ...alertSettings })
}

const createStickToast = (msg) => (
  <div>
    {msg}
    <button onClick={() => toast.dismiss()}>Dismiss</button>
  </div>
)

const notifications = {
  info: (msg) => toast.info(msg, alertSettings),
  success: (msg) => showToast('success', msg),
  warning: (msg) => showToast('loading', msg),
  error: (msg) => showToast('error', msg),
  info_stick: (msg) =>
    toast.custom(createStickToast(msg), { duration: null, ...alertSettings }),
  success_stick: (msg) =>
    toast.success(createStickToast(msg), { duration: null, ...alertSettings }),
  warning_stick: (msg) =>
    toast.loading(createStickToast(msg), { duration: null, ...alertSettings }),
  error_stick: (msg) =>
    toast.error(createStickToast(msg), { duration: null, ...alertSettings }),
}

export default notifications
