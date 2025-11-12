# K-Pop Recording Studio & Cafe - Design Guidelines

## Design Approach
**Reference-Based**: Drawing from Korean digital platforms (Weverse, Kakao) and modern K-pop brand aesthetics. Vibrant, youthful, with bold gradients and dynamic energy while maintaining professional booking functionality.

## Core Design Elements

### Typography
- **Headings**: Inter or Plus Jakarta Sans - Bold (700-800) for impact
- **Korean Text**: Noto Sans KR - Medium (500) for body, Bold (700) for emphasis
- **Body**: 16px base, 18-20px for primary content
- **Hierarchy**: Hero (48-64px) → Section Headers (32-40px) → Card Titles (20-24px)

### Layout System
**Spacing**: Consistently use Tailwind units of **4, 6, 8, 12, 16** (e.g., p-4, gap-8, py-16)
- Section padding: py-16 (mobile) to py-24 (desktop)
- Card padding: p-6 to p-8
- Component gaps: gap-6 to gap-8

### Component Library

**Gradient Buttons** (Primary CTA):
- Multi-color gradients: Purple→Pink→Orange or Blue→Purple
- Bold, pill-shaped (rounded-full), py-4 px-8
- White text, semibold weight
- Shadow-lg for depth

**Cards (Studio/Service Selection)**:
- Rounded-2xl borders, shadow-md
- Image thumbnails at top (aspect-ratio 16:9 or 1:1)
- Padding: p-6
- Hover: Subtle lift with shadow-xl transition

**Booking Sections**:
- Step indicators with gradient progress bars
- Time slot grids (4-5 columns desktop, 2-3 mobile)
- Selection states with gradient borders

**Bilingual Toggle**:
- Fixed position language switcher (KR/EN flags or text)
- Seamless content swap, all text dual-labeled in code

**Navigation**:
- Sticky header with logo + main nav + language toggle
- Gradient underline for active states
- Mobile: Hamburger with slide-out menu

### Naver Booking Page Specifics

**Beverage Selection Module**:
- Grid of beverage cards (3 columns desktop, 2 mobile)
- Thumbnail images, Korean/English names
- Quantity selectors with + / - buttons
- Selected items shown in sticky summary sidebar (desktop) or bottom sheet (mobile)

**Add-on Services**:
- Checkbox list with discount badges
- "20% OFF" or "할인" tags in gradient pills
- Clear pricing: ~~Original~~ Discounted format

**Payment Summary**:
- Sticky right sidebar (desktop) or expandable footer (mobile)
- Line items breakdown, total in bold
- Naver Pay integration button (green #03C75A accent)

## Images

**Hero Image** (Main Booking Page):
- Full-width hero (h-[70vh]) with gradient overlay
- Image: Modern recording studio with neon/LED lighting, K-pop aesthetic
- Buttons overlaid on image with backdrop-blur-md backgrounds

**Section Images**:
- Studio rooms: 3-4 cards with room photos
- Cafe area: Aesthetic beverage and space shots
- Equipment/amenities: Icon-style or photo representations

**Naver Page**:
- Beverage thumbnails: Professional product shots on clean backgrounds
- Service icons/photos: Microphone, headphones, editing suite visuals

## Animations
**Minimal**:
- Gradient button shimmer (subtle)
- Card hover lift (transform scale 1.02)
- Smooth transitions (300ms) on selections

## Page Structure

**Main Booking Flow**:
1. Hero with CTA ("Book Studio" / "예약하기")
2. Studio selection cards (grid)
3. Date/time picker
4. Add-ons selection
5. Summary + confirmation

**Naver Pre-paid Page**:
1. Welcome header with Naver integration indicator
2. Beverage selection grid
3. Discounted add-ons checklist
4. Sticky summary with Naver Pay CTA
5. Confirmation with QR/booking code

**Layout**: Max-width containers (max-w-7xl) for content, full-width for heroes. Use grid-cols-1 md:grid-cols-2 lg:grid-cols-3 for card grids.