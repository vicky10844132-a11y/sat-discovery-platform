// SAT-DISCOVERY 2.0 - Core Application State
// 全局状态管理器

class AppState {
    constructor() {
        this.state = {
            // 当前模块
            currentModule: 'home',
            
            // 数据接入域
            connectors: [],
            activeConnector: null,
            
            // 搜索与过滤域
            searchQuery: null,
            searchResults: [],
            selectedItems: [],
            
            // 轨道预测域
            satellites: [],
            tles: {},
            predictions: [],
            
            // 处理算法域
            algorithms: [],
            activeAlgorithm: null,
            
            // 任务调度域
            tasks: [],
            taskQueue: [],
            
            // 插件管理域
            plugins: [],
            pluginStates: {},
            
            // UI状态
            map: {
                center: [0, 0],
                zoom: 2,
                layers: [],
                aoi: null
            },
            
            // 用户偏好
            preferences: {}
        };
        
        this.listeners = {};
        this.history = [];
        this.maxHistory = 50;
    }
    
    // 获取状态
    get(path) {
        if (!path) return this.state;
        
        const keys = path.split('.');
        let value = this.state;
        
        for (const key of keys) {
            if (value && typeof value === 'object') {
                value = value[key];
            } else {
                return undefined;
            }
        }
        
        return value;
    }
    
    // 设置状态
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let obj = this.state;
        
        for (const key of keys) {
            if (!obj[key]) obj[key] = {};
            obj = obj[key];
        }
        
        const oldValue = obj[lastKey];
        obj[lastKey] = value;
        
        // 记录历史
        this.addHistory({
            timestamp: Date.now(),
            path,
            oldValue,
            newValue: value
        });
        
        // 触发事件
        this.emit('stateChanged', { path, value, oldValue });
        this.emit(`change:${path}`, { value, oldValue });
        
        // 持久化到 localStorage
        this.persist();
    }
    
    // 更新状态（合并对象）
    update(path, updates) {
        const current = this.get(path) || {};
        const newValue = { ...current, ...updates };
        this.set(path, newValue);
    }
    
    // 添加到数组
    push(path, item) {
        const array = this.get(path) || [];
        array.push(item);
        this.set(path, array);
    }
    
    // 从数组移除
    remove(path, predicate) {
        const array = this.get(path) || [];
        const filtered = array.filter(item => !predicate(item));
        this.set(path, filtered);
    }
    
    // 事件监听
    on(event, handler) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(handler);
        
        // 返回取消监听函数
        return () => this.off(event, handler);
    }
    
    // 取消监听
    off(event, handler) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(h => h !== handler);
    }
    
    // 触发事件
    emit(event, data) {
        if (!this.listeners[event]) return;
        
        this.listeners[event].forEach(handler => {
            try {
                handler(data);
            } catch (error) {
                console.error(`Error in ${event} handler:`, error);
            }
        });
    }
    
    // 添加历史记录
    addHistory(entry) {
        this.history.push(entry);
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    }
    
    // 获取历史记录
    getHistory(count = 10) {
        return this.history.slice(-count);
    }
    
    // 持久化到 localStorage
    persist() {
        try {
            const persistentState = {
                connectors: this.state.connectors,
                preferences: this.state.preferences,
                map: this.state.map,
                pluginStates: this.state.pluginStates
            };
            localStorage.setItem('sat_discovery_v2_state', JSON.stringify(persistentState));
        } catch (error) {
            console.error('Failed to persist state:', error);
        }
    }
    
    // 从 localStorage 恢复
    restore() {
        try {
            const saved = localStorage.getItem('sat_discovery_v2_state');
            if (saved) {
                const restored = JSON.parse(saved);
                this.state = { ...this.state, ...restored };
                this.emit('stateRestored', restored);
            }
        } catch (error) {
            console.error('Failed to restore state:', error);
        }
    }
    
    // 重置状态
    reset() {
        const defaultState = {
            currentModule: 'home',
            connectors: [],
            searchResults: [],
            tasks: [],
            plugins: []
        };
        
        Object.keys(defaultState).forEach(key => {
            this.state[key] = defaultState[key];
        });
        
        this.emit('stateReset');
        this.persist();
    }
    
    // 导出状态（用于调试）
    export() {
        return JSON.stringify(this.state, null, 2);
    }
    
    // 导入状态（用于调试）
    import(jsonString) {
        try {
            const imported = JSON.parse(jsonString);
            this.state = imported;
            this.emit('stateImported', imported);
            this.persist();
        } catch (error) {
            console.error('Failed to import state:', error);
        }
    }
}

// 创建全局实例
window.AppState = new AppState();

// 初始化时恢复状态
window.AppState.restore();

console.log('✓ AppState initialized');
