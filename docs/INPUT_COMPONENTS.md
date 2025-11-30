# Input Components

This guide covers all input components in the manxz component library.

---

## Table of Contents

- [Input (Text Field)](#input-text-field)
- [InputGroup (Container)](#inputgroup-container)
- [InputSplit (Two Fields)](#inputsplit-two-fields)
- [InputSelect (Dropdown)](#inputselect-dropdown)
- [InputAddress (Address Search)](#inputaddress-address-search)
- [InputRadio (Radio Button)](#inputradio-radio-button)
- [InputBank (Bank Account)](#inputbank-bank-account)
- [InputMenu (Navigation Row)](#inputmenu-navigation-row)

---

## Input (Text Field)

A standard text input with animated placeholder that moves up when focused/filled.

### Import

```tsx
import { Input } from 'manxz-components';
```

### Basic Usage

```tsx
const [email, setEmail] = useState('');

<Input
  placeholder="Email address"
  value={email}
  onChangeText={setEmail}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Controlled input value |
| `defaultValue` | `string` | - | Uncontrolled default value |
| `placeholder` | `string` | `''` | Placeholder text (becomes label when focused) |
| `helperText` | `string` | - | Helper text shown below input |
| `errorText` | `string` | - | Error text (triggers error state) |
| `disabled` | `boolean` | `false` | Disables input |
| `onChangeText` | `(text: string) => void` | - | Called when text changes |
| `onFocus` | `() => void` | - | Called when input receives focus |
| `onBlur` | `() => void` | - | Called when input loses focus |
| `fullWidth` | `boolean` | `true` | Whether input takes full width |
| `testID` | `string` | - | Test identifier |

### States

- **Default**: Placeholder centered, gray border
- **Focused**: Blue border, placeholder moves up as label
- **Filled**: Placeholder stays as label, value shown
- **Error**: Red border/background, error text below
- **Disabled**: Gray background, non-interactive

### Example with Validation

```tsx
const [email, setEmail] = useState('');
const [error, setError] = useState('');

<Input
  placeholder="Email address"
  value={email}
  onChangeText={(text) => {
    setEmail(text);
    setError(text.includes('@') ? '' : 'Please enter a valid email');
  }}
  errorText={error}
  helperText="We'll never share your email"
/>
```

---

## InputGroup (Container)

**This is often where people get confused!** InputGroup is a wrapper that stacks multiple inputs vertically with dividers between them. It creates a single visual "card" with rounded corners.

### Import

```tsx
import { InputGroup, Input, InputRadio, InputMenu } from 'manxz-components';
```

### Basic Usage

```tsx
<InputGroup>
  <Input placeholder="First name" />
  <Input placeholder="Last name" />
  <Input placeholder="Email" />
</InputGroup>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | **required** | Input components to stack |
| `disabled` | `boolean` | `false` | Disables ALL children |
| `fullWidth` | `boolean` | `true` | Whether group takes full width |
| `testID` | `string` | - | Test identifier |

### What Happens Inside InputGroup

When you put inputs inside InputGroup:

1. **Border handling**: InputGroup adds the outer border and dividers—individual inputs don't have their own borders
2. **Corner rounding**: First input gets top corners rounded, last input gets bottom corners rounded
3. **Shadow**: One shadow for the whole group, not per-input
4. **Disabled cascade**: Setting `disabled` on InputGroup disables all children

### ⚠️ Common Mistakes

**Wrong - wrapping inputs in a View inside InputGroup:**

```tsx
// ❌ BAD - View wrapper breaks the group styling!
<InputGroup>
  <Input placeholder="First" />
  <View>
    <Input placeholder="Second" />
    <Input placeholder="Third" />
  </View>
</InputGroup>
```

InputGroup passes special props to its **direct children**. Wrapping inputs in a View intercepts those props and breaks everything.

**Right - all inputs must be direct children:**

```tsx
// ✅ GOOD - inputs are direct children
<InputGroup>
  <Input placeholder="First" />
  <Input placeholder="Second" />
  <Input placeholder="Third" />
</InputGroup>
```

**Need separate sections? Use multiple InputGroups:**

```tsx
// ✅ GOOD - two separate groups
<View style={{ gap: 24 }}>
  <InputGroup>
    <Input placeholder="Name" />
  </InputGroup>
  
  <InputGroup>
    <Input placeholder="Email" />
    <Input placeholder="Phone" />
  </InputGroup>
</View>
```

### Example: Registration Form

```tsx
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [email, setEmail] = useState('');

<InputGroup>
  <Input
    placeholder="First name"
    value={firstName}
    onChangeText={setFirstName}
  />
  <Input
    placeholder="Last name"
    value={lastName}
    onChangeText={setLastName}
  />
  <Input
    placeholder="Email"
    value={email}
    onChangeText={setEmail}
    keyboardType="email-address"
  />
</InputGroup>
```

### Example: Mixed Input Types

```tsx
<InputGroup>
  <Input placeholder="Full name" />
  <InputSelect
    placeholder="Country"
    options={countries}
    onChange={setCountry}
  />
  <InputAddress
    placeholder="Address"
    onSelectAddress={setAddress}
  />
</InputGroup>
```

### Example: Settings Menu

```tsx
<InputGroup>
  <InputMenu label="Account" onPress={() => navigate('account')} />
  <InputMenu label="Notifications" onPress={() => navigate('notifications')} />
  <InputMenu label="Privacy" onPress={() => navigate('privacy')} />
  <InputMenu label="Help" onPress={() => navigate('help')} />
</InputGroup>
```

### Example: Radio Selection

```tsx
const [plan, setPlan] = useState('free');

<InputGroup>
  <InputRadio
    label="Free Plan"
    selected={plan === 'free'}
    onPress={() => setPlan('free')}
  />
  <InputRadio
    label="Pro Plan - $9/month"
    selected={plan === 'pro'}
    onPress={() => setPlan('pro')}
  />
  <InputRadio
    label="Enterprise - Contact us"
    selected={plan === 'enterprise'}
    onPress={() => setPlan('enterprise')}
  />
</InputGroup>
```

---

## InputSplit (Two Fields)

Two inputs side by side in a single row with a vertical divider.

### Import

```tsx
import { InputSplit } from 'manxz-components';
```

### Basic Usage

```tsx
<InputSplit
  leftPlaceholder="First name"
  rightPlaceholder="Last name"
  onLeftChange={setFirstName}
  onRightChange={setLastName}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `leftPlaceholder` | `string` | - | Left input placeholder |
| `rightPlaceholder` | `string` | - | Right input placeholder |
| `leftValue` | `string` | - | Left input value |
| `rightValue` | `string` | - | Right input value |
| `onLeftChange` | `(text: string) => void` | - | Left input change handler |
| `onRightChange` | `(text: string) => void` | - | Right input change handler |
| `disabled` | `boolean` | `false` | Disables both inputs |
| `fullWidth` | `boolean` | `true` | Full width |
| `testID` | `string` | - | Test identifier |

### Example: Expiry Date and CVV

```tsx
<InputSplit
  leftPlaceholder="MM/YY"
  rightPlaceholder="CVV"
  leftValue={expiry}
  rightValue={cvv}
  onLeftChange={setExpiry}
  onRightChange={setCvv}
/>
```

### Inside InputGroup

```tsx
<InputGroup>
  <Input placeholder="Card number" />
  <InputSplit
    leftPlaceholder="MM/YY"
    rightPlaceholder="CVV"
  />
</InputGroup>
```

---

## InputSelect (Dropdown)

Opens a full-screen modal with options to choose from.

### Import

```tsx
import { InputSelect } from 'manxz-components';
```

### Basic Usage

```tsx
const [country, setCountry] = useState('');

const countries = [
  { label: 'United States', value: 'us' },
  { label: 'Canada', value: 'ca' },
  { label: 'Mexico', value: 'mx' },
];

<InputSelect
  placeholder="Country"
  value={country}
  options={countries}
  onChange={setCountry}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Currently selected value |
| `placeholder` | `string` | - | Placeholder text |
| `options` | `SelectOption[]` | **required** | Array of `{ label, value }` |
| `modalTitle` | `string` | - | Modal header title |
| `helperText` | `string` | - | Helper text below input |
| `errorText` | `string` | - | Error text |
| `disabled` | `boolean` | `false` | Disables input |
| `onChange` | `(value: string) => void` | - | Selection callback |
| `fullWidth` | `boolean` | `true` | Full width |
| `testID` | `string` | - | Test identifier |

---

## InputAddress (Address Search)

Opens a modal with a search input for address autocomplete.

### Import

```tsx
import { InputAddress } from 'manxz-components';
```

### Basic Usage

```tsx
const [address, setAddress] = useState('');
const [suggestions, setSuggestions] = useState([]);

<InputAddress
  placeholder="Address"
  value={address}
  suggestions={suggestions}
  onChangeText={async (text) => {
    // Fetch suggestions from your geocoding API
    const results = await geocodeApi.search(text);
    setSuggestions(results.map(r => ({
      id: r.id,
      address: r.formatted_address,
    })));
  }}
  onSelectAddress={setAddress}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Selected address |
| `placeholder` | `string` | `'Address'` | Placeholder text |
| `suggestions` | `AddressSuggestion[]` | `[]` | Array of `{ id, address }` |
| `maxSuggestions` | `number` | `5` | Max suggestions to show |
| `helperText` | `string` | - | Helper text |
| `errorText` | `string` | - | Error text |
| `disabled` | `boolean` | `false` | Disables input |
| `onChangeText` | `(text: string) => void` | - | Called as user types (fetch suggestions here) |
| `onSelectAddress` | `(address: string) => void` | - | Called when address selected |
| `fullWidth` | `boolean` | `true` | Full width |
| `testID` | `string` | - | Test identifier |

---

## InputRadio (Radio Button)

A selectable row with label and radio circle. Use inside InputGroup for radio groups.

### Import

```tsx
import { InputRadio, InputGroup } from 'manxz-components';
```

### Basic Usage

```tsx
const [selected, setSelected] = useState('option1');

<InputGroup>
  <InputRadio
    label="Option 1"
    selected={selected === 'option1'}
    onPress={() => setSelected('option1')}
  />
  <InputRadio
    label="Option 2"
    selected={selected === 'option2'}
    onPress={() => setSelected('option2')}
  />
</InputGroup>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | **required** | Text label |
| `selected` | `boolean` | `false` | Whether selected |
| `disabled` | `boolean` | `false` | Disables interaction |
| `errorText` | `string` | - | Triggers error styling |
| `onPress` | `() => void` | - | Tap callback |
| `fullWidth` | `boolean` | `true` | Full width |
| `testID` | `string` | - | Test identifier |

---

## InputBank (Bank Account)

Displays bank account info or an empty "Connect bank" state. Acts as a button to trigger Plaid/bank connection flow.

### Import

```tsx
import { InputBank } from 'manxz-components';
```

### Empty State

```tsx
<InputBank
  onPress={() => openPlaidLink()}
  helperText="Required for receiving payments"
/>
```

### Filled State

```tsx
<InputBank
  bank={{
    name: 'Chase Bank',
    logoUrl: 'https://logo.clearbit.com/chase.com',
    logoBackgroundColor: '#004fc2',
    routingNumber: '021000021',
    cardLastFour: '5671',
  }}
  onPress={() => openPlaidLink()}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `bank` | `BankAccount \| null` | - | Bank details (null = empty state) |
| `emptyTitle` | `string` | `'Connect bank account'` | Empty state title |
| `emptySubtitle` | `string` | `'3-4 business days'` | Empty state subtitle |
| `helperText` | `string` | - | Helper text |
| `errorText` | `string` | - | Error text |
| `disabled` | `boolean` | `false` | Disables interaction |
| `onPress` | `() => void` | - | Tap callback (open Plaid) |
| `fullWidth` | `boolean` | `true` | Full width |
| `testID` | `string` | - | Test identifier |

### BankAccount Type

```tsx
interface BankAccount {
  name: string;                    // "Chase Bank"
  logoUrl?: string;                // URL or require()
  logoComponent?: ReactNode;       // Custom component (takes precedence)
  logoBackgroundColor?: string;    // "#004fc2"
  routingNumber?: string;          // "021000021"
  cardLastFour?: string;           // "5671"
}
```

---

## InputMenu (Navigation Row)

A simple row with label and chevron for navigation/settings menus.

### Import

```tsx
import { InputMenu, InputGroup } from 'manxz-components';
```

### Basic Usage

```tsx
<InputGroup>
  <InputMenu label="Account Settings" onPress={() => navigate('account')} />
  <InputMenu label="Notifications" onPress={() => navigate('notifications')} />
  <InputMenu label="Privacy" onPress={() => navigate('privacy')} />
</InputGroup>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | **required** | Row label |
| `disabled` | `boolean` | `false` | Disables interaction |
| `onPress` | `() => void` | - | Tap callback |
| `fullWidth` | `boolean` | `true` | Full width |
| `testID` | `string` | - | Test identifier |

### Standalone (without InputGroup)

```tsx
<InputMenu
  label="View all transactions"
  onPress={() => navigate('transactions')}
/>
```

---

## Full Example: Checkout Form

```tsx
import {
  Input,
  InputGroup,
  InputSplit,
  InputSelect,
  InputAddress,
  InputBank,
} from 'manxz-components';

function CheckoutForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [bank, setBank] = useState(null);

  return (
    <View style={{ gap: 24, padding: 16 }}>
      {/* Personal Info */}
      <InputGroup>
        <Input
          placeholder="Full name"
          value={name}
          onChangeText={setName}
        />
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </InputGroup>

      {/* Address */}
      <InputGroup>
        <InputAddress
          placeholder="Street address"
          value={address}
          onSelectAddress={setAddress}
        />
        <InputSelect
          placeholder="Country"
          value={country}
          options={countries}
          onChange={setCountry}
        />
      </InputGroup>

      {/* Payment */}
      <InputBank
        bank={bank}
        onPress={async () => {
          const result = await openPlaidLink();
          if (result) setBank(result);
        }}
        helperText="Required for receiving payments"
      />
    </View>
  );
}
```

---

## Questions?

Ping Oscar if something's unclear!

