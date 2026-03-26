// store/theme.js
export const state = () => ({
    isDark: false,
})

export const mutations = {
    SET_DARK_MODE(state, payload) {
        state.isDark = payload
    },
}

export const actions = {
    toggleTheme({ commit, state }) {
        const newTheme = !state.isDark
        commit('SET_DARK_MODE', newTheme)
        localStorage.setItem('isDark', newTheme)
    },
    loadTheme({ commit }) {
        const saved = localStorage.getItem('isDark')
        commit('SET_DARK_MODE', saved === 'true')
    },
}