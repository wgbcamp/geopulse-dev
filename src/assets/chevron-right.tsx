// Tail-less counterpart to ArrowRight, sized to sit inside a filled circle.
export const ChevronRight = ({ color }: { color: string }) => (
    <svg width="12" height="18" viewBox="0 0 12 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.5 2.5L9.5 9L2.5 15.5" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)
