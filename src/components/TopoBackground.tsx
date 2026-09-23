import { useEffect, useRef } from 'react'

// Procedural contour-line background: seeded simplex noise traced with marching squares.
// Drop it as the first child of a `relative isolate` container — it fills that container, redraws
// when the container resizes, and sits behind every sibling (-z-10 inside the isolated stack).
// Sections with their own opaque background simply cover it.

const SEED        = 12     // any integer; same seed always gives the same map
const SCALE       = 720    // size of the landforms in px (bigger = broader shapes)
const SPACING     = 0.45   // gap between contour levels (smaller = more lines)
const MAJOR_EVERY = 3      // every Nth line is drawn heavier
const STEP        = 4      // tracing resolution in px (smaller = smoother, slower)
const WARP        = 0.25   // how much the lines meander; 0 = smooth, 0.6 = very wiggly

function makeNoise(seed: number) {
    let s = seed >>> 0
    const rand = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296
    const p = new Uint8Array(256)
    for (let i = 0; i < 256; i++) p[i] = i
    for (let i = 255; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); const t = p[i]; p[i] = p[j]; p[j] = t }
    const perm = new Uint8Array(512)
    for (let i = 0; i < 512; i++) perm[i] = p[i & 255]
    const g = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]]
    const F2 = 0.5 * (Math.sqrt(3) - 1), G2 = (3 - Math.sqrt(3)) / 6

    return (x: number, y: number) => {
        const sk = (x + y) * F2
        const i = Math.floor(x + sk), j = Math.floor(y + sk)
        const t = (i + j) * G2
        const x0 = x - (i - t), y0 = y - (j - t)
        const i1 = x0 > y0 ? 1 : 0, j1 = x0 > y0 ? 0 : 1
        const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2
        const x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2
        const ii = i & 255, jj = j & 255
        const corner = (dx: number, dy: number, gi: number) => {
            let tt = 0.5 - dx * dx - dy * dy
            if (tt < 0) return 0
            tt *= tt
            const gr = g[gi & 7]
            return tt * tt * (gr[0] * dx + gr[1] * dy)
        }
        return 70 * (corner(x0, y0, perm[ii + perm[jj]])
                   + corner(x1, y1, perm[ii + i1 + perm[jj + j1]])
                   + corner(x2, y2, perm[ii + 1 + perm[jj + 1]]))
    }
}

const noise = makeNoise(SEED)

// broad shapes, finer detail on top, plus a warp so lines wander instead of forming neat rings
function terrain(x: number, y: number) {
    const nx = x / SCALE, ny = y / SCALE
    const wx = nx + WARP * noise(nx * 1.7 + 11.3, ny * 1.7 - 4.1)
    const wy = ny + WARP * noise(nx * 1.7 - 7.9, ny * 1.7 + 2.6)
    return noise(wx, wy)
         + 0.22 * noise(wx * 2.1 + 31, wy * 2.1 + 17)
         + 0.04 * noise(wx * 4.3 - 9, wy * 4.3 + 63)
}

// marching squares, with each level's segments chained into long smoothed polylines
function build(width: number, heightPx: number) {
    const cols = Math.ceil(width / STEP) + 1
    const rows = Math.ceil(heightPx / STEP) + 1
    const v = new Float32Array(cols * rows)
    for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++)
            v[j * cols + i] = terrain(i * STEP, j * STEP)

    const byLevel = new Map<number, number[]>()

    for (let j = 0; j < rows - 1; j++) {
        const row = j * cols, row2 = (j + 1) * cols
        const y0 = j * STEP, y1 = y0 + STEP
        for (let i = 0; i < cols - 1; i++) {
            const tl = v[row + i], tr = v[row + i + 1]
            const bl = v[row2 + i], br = v[row2 + i + 1]
            const mn = Math.min(tl, tr, br, bl), mx = Math.max(tl, tr, br, bl)
            let k = Math.ceil(mn / SPACING)
            const kMax = Math.floor(mx / SPACING)
            if (k > kMax) continue

            const x0 = i * STEP, x1 = x0 + STEP
            for (; k <= kMax; k++) {
                const th = k * SPACING
                const c = (tl > th ? 8 : 0) | (tr > th ? 4 : 0) | (br > th ? 2 : 0) | (bl > th ? 1 : 0)
                if (c === 0 || c === 15) continue

                const T = () => [x0 + STEP * (th - tl) / (tr - tl), y0]
                const R = () => [x1, y0 + STEP * (th - tr) / (br - tr)]
                const B = () => [x0 + STEP * (th - bl) / (br - bl), y1]
                const L = () => [x0, y0 + STEP * (th - tl) / (bl - tl)]

                let arr = byLevel.get(k)
                if (!arr) { arr = []; byLevel.set(k, arr) }
                const seg = (a: number[], b: number[]) => arr.push(a[0], a[1], b[0], b[1])

                switch (c) {
                    case 1: case 14: seg(L(), B()); break
                    case 2: case 13: seg(B(), R()); break
                    case 3: case 12: seg(L(), R()); break
                    case 4: case 11: seg(T(), R()); break
                    case 6: case 9:  seg(T(), B()); break
                    case 7: case 8:  seg(L(), T()); break
                    case 5:  seg(T(), R()); seg(L(), B()); break
                    case 10: seg(L(), T()); seg(B(), R()); break
                }
            }
        }
    }

    const minor: string[] = [], major: string[] = []
    const f = (n: number) => n.toFixed(1)
    const key = (x: number, y: number) => x.toFixed(3) + ',' + y.toFixed(3)

    for (const [k, arr] of byLevel) {
        const n = arr.length / 4
        const ends = new Map<string, number[]>()
        for (let s = 0; s < n; s++) {
            for (const kk of [key(arr[s * 4], arr[s * 4 + 1]), key(arr[s * 4 + 2], arr[s * 4 + 3])]) {
                let l = ends.get(kk); if (!l) { l = []; ends.set(kk, l) }
                l.push(s)
            }
        }
        const used = new Uint8Array(n)

        // follow unused segments from (cx, cy), calling push for each new point
        const extend = (cx: number, cy: number, push: (x: number, y: number) => void) => {
            for (;;) {
                const list = ends.get(key(cx, cy))
                if (!list) break
                const next = list.find(t => !used[t])
                if (next === undefined) break
                used[next] = 1
                const ax = arr[next * 4], ay = arr[next * 4 + 1], bx = arr[next * 4 + 2], by = arr[next * 4 + 3]
                if (Math.abs(ax - cx) < 1e-9 && Math.abs(ay - cy) < 1e-9) { cx = bx; cy = by }
                else { cx = ax; cy = ay }
                push(cx, cy)
            }
        }

        const out = k % MAJOR_EVERY === 0 ? major : minor

        for (let s = 0; s < n; s++) {
            if (used[s]) continue
            used[s] = 1
            const fwd = [arr[s * 4], arr[s * 4 + 1], arr[s * 4 + 2], arr[s * 4 + 3]]
            extend(fwd[2], fwd[3], (x, y) => fwd.push(x, y))
            const back: number[] = []
            extend(fwd[0], fwd[1], (x, y) => back.unshift(x, y))
            const pts = back.concat(fwd)
            if (pts.length < 6) continue // drop specks

            // quadratic curves through the midpoints of the polyline
            let d = 'M' + f(pts[0]) + ' ' + f(pts[1])
            for (let q = 2; q < pts.length - 2; q += 2) {
                const mx2 = (pts[q] + pts[q + 2]) / 2, my2 = (pts[q + 1] + pts[q + 3]) / 2
                d += 'Q' + f(pts[q]) + ' ' + f(pts[q + 1]) + ' ' + f(mx2) + ' ' + f(my2)
            }
            d += 'L' + f(pts[pts.length - 2]) + ' ' + f(pts[pts.length - 1])
            out.push(d)
        }
    }
    return { minor: minor.join(''), major: major.join('') }
}

export function TopoBackground({ className = '' }: { className?: string }) {
    const svgRef = useRef<SVGSVGElement>(null)
    const minorRef = useRef<SVGPathElement>(null)
    const majorRef = useRef<SVGPathElement>(null)

    useEffect(() => {
        const svg = svgRef.current
        if (!svg) return
        let lastW = 0, lastH = 0
        let timer: ReturnType<typeof setTimeout>

        // the svg is absolute inset-0, so its own box is the container's full scroll size
        const render = () => {
            const w = Math.round(svg.clientWidth), h = Math.round(svg.clientHeight)
            if (!w || !h || (w === lastW && h === lastH)) return
            lastW = w; lastH = h
            svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
            const d = build(w, h)
            minorRef.current?.setAttribute('d', d.minor)
            majorRef.current?.setAttribute('d', d.major)
        }

        render()
        const observer = new ResizeObserver(() => { clearTimeout(timer); timer = setTimeout(render, 150) })
        observer.observe(svg)
        return () => { observer.disconnect(); clearTimeout(timer) }
    }, [])

    return (
        <svg
            ref={svgRef}
            aria-hidden
            className={`absolute inset-0 w-full h-full -z-10 pointer-events-none opacity-55 ${className}`}
            fill='none'
            strokeLinecap='round'
            strokeLinejoin='round'
        >
            <defs>
                {/* soft light wash that fades the lines toward the middle of the page */}
                <radialGradient id='topoWash' cx='50%' cy='35%' r='75%'>
                    <stop offset='0%' stopColor='#fff' stopOpacity={0.85} />
                    <stop offset='55%' stopColor='#fff' stopOpacity={0.25} />
                    <stop offset='100%' stopColor='#fff' stopOpacity={0} />
                </radialGradient>
            </defs>
            <path ref={minorRef} stroke='#cdd1d5' strokeWidth={1} />
            <path ref={majorRef} stroke='#b6bcc3' strokeWidth={1.1} />
            <rect width='100%' height='100%' fill='url(#topoWash)' />
        </svg>
    )
}
