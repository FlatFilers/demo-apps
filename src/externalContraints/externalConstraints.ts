import { PhoneNumberUtil } from 'google-libphonenumber'

const phoneUtil = PhoneNumberUtil.getInstance()

export const externalConstraints = {
  length: {
    validator: (value, key, { config, record }) => {
      if (value) {
        const minLength = config.min || 1
        const maxLength = config.max

        if (value.length < minLength || value.length > maxLength) {
          record.addError(
            key,
            `Text must be between ${minLength} and ${maxLength} characters.`
          )
        }
      }
    },
  },
  email: {
    validator: (value, key, { record }) => {
      if (value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          record.addError(key, 'Invalid email format.')
        }
      }
    },
  },
  phone: {
    validator: (value, key, { config, record }) => {
      if (value) {
        try {
          const phoneNumber = phoneUtil.parse(value, config.region)
          if (!phoneUtil.isValidNumber(phoneNumber)) {
            record.addError(key, 'Invalid phone number.')
          }
        } catch (error) {
          record.addError(key, 'Invalid phone number format.')
        }
      }
    },
  },
  zipCode: {
    validator: (value, key, { config, record }) => {
      if (value) {
        const zipCodeRegex = /^\d{5}(?:[-\s]\d{4})?$/
        if (!zipCodeRegex.test(value)) {
          record.addError(key, `Invalid ${config.countryCode} zip code format.`)
        }
      }
    },
  },
  date: {
    validator: (value, key, { config, record }) => {
      if (value) {
        // Convert format string to regex pattern
        const formatToRegex = (format) => {
          const escapeRegExp = (string) =>
            string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          let pattern = escapeRegExp(format)
            .replace(/YYYY/g, '(\\d{4})')
            .replace(/MM/g, '(0[1-9]|1[0-2])')
            .replace(/DD/g, '(0[1-9]|[12][0-9]|3[01])')
          return new RegExp(`^${pattern}$`)
        }

        const dateRegex = formatToRegex(config.format)
        if (!dateRegex.test(value)) {
          record.addError(
            key,
            `Invalid date format. Expected format: ${config.format}.`
          )
        } else {
          // Simple check to ensure the date is valid. More complex validation might be needed for specific cases.
          const date = new Date(value)
          if (isNaN(date.getTime())) {
            record.addError(key, `Invalid date value.`)
          }
        }
      }
    },
  },
  url: {
    validator: (value, key, { record }) => {
      if (value) {
        const urlRegex =
          /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
        if (!urlRegex.test(value)) {
          record.addError(key, 'Invalid URL format.')
        }
      }
    },
  },
  dateRange: {
    validator: (value, key, { config, record }) => {
      if (value) {
        // Convert format string to regex pattern
        const formatToRegex = (format) => {
          const escapeRegExp = (string) =>
            string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          let pattern = escapeRegExp(format)
            .replace(/YYYY/g, '(\\d{4})')
            .replace(/MM/g, '(0[1-9]|1[0-2])')
            .replace(/DD/g, '(0[1-9]|[12][0-9]|3[01])')
          return new RegExp(`^${pattern}$`)
        }

        const dateRegex = formatToRegex(config.format || 'YYYY-MM-DD') // Default to 'YYYY-MM-DD' if no format is provided
        if (!dateRegex.test(value)) {
          record.addError(
            key,
            `Invalid date format. Expected format: ${
              config.format || 'YYYY-MM-DD'
            }.`
          )
        } else {
          const date = new Date(value)
          const minDate = config.min ? new Date(config.min) : null
          const maxDate = config.max ? new Date(config.max) : null
          if ((minDate && date < minDate) || (maxDate && date > maxDate)) {
            record.addError(
              key,
              `Date must be between ${config.min} and ${config.max}.`
            )
          }
        }
      }
    },
  },

  numberRange: {
    validator: (value, key, { config, record }) => {
      if (value !== undefined && value !== null) {
        const numericValue = Number(value)
        if (isNaN(numericValue)) {
          record.addError(key, 'Invalid numeric value.')
        } else if (numericValue < config.min || numericValue > config.max) {
          record.addError(
            key,
            `Number must be between ${config.min} and ${config.max}.`
          )
        }
      }
    },
  },
  dateTimeRange: {
    validator: (value, key, { config, record }) => {
      if (value) {
        const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/
        if (!dateTimeRegex.test(value)) {
          record.addError(
            key,
            'Invalid date/time format. Expected format: YYYY-MM-DDTHH:mm:ss.'
          )
        } else {
          const dateTime = new Date(value)
          const minDateTime = config.min ? new Date(config.min) : null
          const maxDateTime = config.max ? new Date(config.max) : null
          if (
            (minDateTime && dateTime < minDateTime) ||
            (maxDateTime && dateTime > maxDateTime)
          ) {
            record.addError(
              key,
              `Date/time must be between ${config.min || 'any'} and ${
                config.max || 'any'
              }.`
            )
          }
        }
      }
    },
  },
}
