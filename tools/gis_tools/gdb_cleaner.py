import os
import sys

# 必须保留这段代码在 import gdal (osgeo) 之前
if getattr(sys, 'frozen', False):
    # 这里写死路径，因为 --collect-all osgeo 会把数据放在这个特定目录下
    # 注意：不同版本 PyInstaller 目录结构可能微调，通常如下：
    os.environ['PROJ_LIB'] = os.path.join(sys._MEIPASS, 'osgeo', 'data', 'proj')
    os.environ['GDAL_DATA'] = os.path.join(sys._MEIPASS, 'osgeo', 'data')

import tkinter as tk
from tkinter import filedialog, messagebox, scrolledtext, ttk
from osgeo import ogr
import threading
import shutil
import time

class GDBCleanerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("GDB空要素图层批量清理工具")

        # Geometry and centering
        # Reduced width slightly to ensure it fits compact screens, but layout is flexible
        window_width = 700
        window_height = 550
        self.center_window(window_width, window_height)

        # Set Icon
        try:
            self.root.iconbitmap(self.resource_path("favicon.ico"))
        except Exception:
            pass

        # Apply a simple theme
        style = ttk.Style()
        try:
            style.theme_use('vista') 
        except:
            pass

        style.configure("Big.TButton", font=("Microsoft YaHei", 10, "bold"))
        style.configure("TRadiobutton", font=("Microsoft YaHei", 9))

        # Define fonts
        self.font_style = ("Microsoft YaHei", 10)

        # Variables
        self.gdb_path = tk.StringVar()
        self.run_mode = tk.StringVar(value="backup")  # Default to backup mode

        # UI Layout
        self.create_widgets()

    def center_window(self, width, height):
        screen_width = self.root.winfo_screenwidth()
        screen_height = self.root.winfo_screenheight()
        x = (screen_width // 2) - (width // 2)
        y = (screen_height // 2) - (height // 2)
        self.root.geometry(f'{width}x{height}+{x}+{y}')

    def create_widgets(self):
        # 1. GDB Selection Area
        frame_top = tk.LabelFrame(self.root, text="设置", font=self.font_style, padx=10, pady=10)
        frame_top.pack(fill="x", padx=10, pady=5)

        # Use grid column configuration to make the entry expand
        frame_top.columnconfigure(1, weight=1)

        lbl_path = tk.Label(frame_top, text="GDB路径:", font=self.font_style)
        lbl_path.grid(row=0, column=0, sticky="w", padx=(0, 5))

        entry_path = tk.Entry(frame_top, textvariable=self.gdb_path, font=self.font_style)
        entry_path.grid(row=0, column=1, sticky="ew", padx=5)

        btn_browse = ttk.Button(frame_top, text="浏览...", command=self.browse_gdb)
        btn_browse.grid(row=0, column=2, padx=(5, 0))

        # Mode Selection
        frame_mode = tk.Frame(frame_top)
        frame_mode.grid(row=1, column=0, columnspan=3, sticky="w", pady=(10, 0))

        lbl_mode = tk.Label(frame_mode, text="处理模式:", font=self.font_style)
        lbl_mode.pack(side="left", padx=(0, 10))

        rb_backup = ttk.Radiobutton(frame_mode, text="复制并清理 (推荐)", variable=self.run_mode, value="backup")
        rb_backup.pack(side="left", padx=10)

        rb_direct = ttk.Radiobutton(frame_mode, text="直接在原文件上清理", variable=self.run_mode, value="direct")
        rb_direct.pack(side="left", padx=10)

        # 2. Action Area
        frame_action = tk.Frame(self.root, padx=10, pady=5)
        frame_action.pack(fill="x", padx=10)

        self.btn_run = ttk.Button(frame_action, text="开始清理", command=self.start_cleaning_thread, 
                                  style="Big.TButton", cursor="hand2")
        self.btn_run.pack(fill="x", pady=5, ipady=5) 

        # 3. Log Area
        frame_log = tk.LabelFrame(self.root, text="操作日志", font=self.font_style, padx=10, pady=10)
        frame_log.pack(fill="both", expand=True, padx=10, pady=5)

        self.log_text = scrolledtext.ScrolledText(frame_log, state='disabled', font=("Consolas", 9))
        self.log_text.pack(fill="both", expand=True)

    def browse_gdb(self):
        path = filedialog.askdirectory(title="选择GDB数据库 (.gdb 文件夹)")
        if path:
            if not path.endswith(".gdb"):
                self.log(f"[警告] 选择的路径 '{path}' 似乎不是标准的 .gdb 文件夹", "warning")
            self.gdb_path.set(path)
            self.log(f"[信息] 已选择数据库: {path}")

    def log(self, message, level="info"):
        self.log_text.config(state='normal')

        # Add timestamp
        timestamp = time.strftime("%H:%M:%S", time.localtime())
        msg_with_time = f"[{timestamp}] {message}"

        if level == "error":
            self.log_text.insert(tk.END, f"{msg_with_time}\\n", "error")
        elif level == "warning":
            self.log_text.insert(tk.END, f"{msg_with_time}\\n", "warning")
        elif level == "success":
            self.log_text.insert(tk.END, f"{msg_with_time}\\n", "success")
        elif level == "highlight":
            self.log_text.insert(tk.END, f"{msg_with_time}\\n", "highlight")
        else:
            self.log_text.insert(tk.END, f"{msg_with_time}\\n")

        self.log_text.tag_config("error", foreground="red")
        self.log_text.tag_config("warning", foreground="#FF9800")
        self.log_text.tag_config("success", foreground="green")
        self.log_text.tag_config("highlight", foreground="blue", font=("Microsoft YaHei", 9, "bold"))

        self.log_text.see(tk.END)
        self.log_text.config(state='disabled')

    def start_cleaning_thread(self):
        path = self.gdb_path.get()
        if not path or not os.path.exists(path):
            messagebox.showerror("错误", "请先选择有效的 GDB 路径！")
            return

        mode = self.run_mode.get()
        confirm_msg = "即将开始处理。\\n模式: 复制并清理" if mode == "backup" else "警告！即将直接修改原数据。\\n此操作不可恢复！"

        if not messagebox.askyesno("确认", confirm_msg):
            return

        self.btn_run.config(state="disabled", text="正在处理...")
        thread = threading.Thread(target=self.process_gdb_logic, args=(path, mode))
        thread.daemon = True
        thread.start()

    def process_gdb_logic(self, original_path, mode):
        # Determine actual target path
        target_path = original_path

        if mode == "backup":
            dirname = os.path.dirname(original_path)
            basename = os.path.basename(original_path)
            name_no_ext = os.path.splitext(basename)[0]
            new_name = f"{name_no_ext}_clean.gdb"
            target_path = os.path.join(dirname, new_name)

            self.log(f"正在创建副本: {target_path} ...")
            try:
                if os.path.exists(target_path):
                    self.log(f"副本已存在，将被覆盖: {target_path}", "warning")
                    shutil.rmtree(target_path)

                shutil.copytree(original_path, target_path)
                self.log("副本创建成功。", "success")
            except Exception as e:
                self.log(f"创建副本失败: {e}", "error")
                self.reset_ui()
                return

        self.clean_gdb(target_path)

    def clean_gdb(self, gdb_path):
        self.log("-" * 40)
        # Verify gdb path again roughly
        if not gdb_path.endswith(".gdb"):
             self.log(f"注意：目标路径没有 .gdb 后缀，可能处理失败: {gdb_path}", "warning")

        self.log(f"正在打开数据库: {gdb_path}")

        try:
            ds = ogr.Open(gdb_path, 1)  # 1 = Update mode

            if ds is None:
                self.log("无法以写入模式打开数据库。可能是文件损坏或被占用。", "error")
                self.reset_ui()
                return

            layer_count = ds.GetLayerCount()
            self.log(f"数据库打开成功。共发现 {layer_count} 个图层。")

            deleted_layers = []

            # Iterate backwards to avoid index shifting problems when deleting
            for i in range(layer_count - 1, -1, -1):
                layer = ds.GetLayerByIndex(i)
                if layer is None:
                    continue

                layer_name = layer.GetName()
                feature_count = layer.GetFeatureCount()

                if feature_count == 0:
                    try:
                        # Log before deleting
                        # self.log(f"发现空图层: {layer_name}")
                        if ds.DeleteLayer(i) == 0:  # OGRERR_NONE = 0
                            self.log(f"已删除图层: {layer_name}", "success")
                            deleted_layers.append(layer_name)
                        else:
                            self.log(f"删除失败: {layer_name}", "error")
                    except Exception as e:
                        self.log(f"删除异常 {layer_name}: {str(e)}", "error")

            self.log("-" * 40)
            self.log(f"处理完成。", "highlight")
            self.log(f"原图层总数: {layer_count}")
            self.log(f"成功删除空图层数: {len(deleted_layers)}", "highlight")

            if len(deleted_layers) > 0:
                self.log("删除列表如下:")
                for name in deleted_layers:
                    self.log(f" - {name}")
            else:
                self.log("未发现空图层，无任何变动。")

            # Force cleanup
            ds = None

        except Exception as e:
            self.log(f"发生意外错误: {str(e)}", "error")
            import traceback
            traceback.print_exc()
        finally:
            self.reset_ui()

    def resource_path(self, relative_path):
        """ Get absolute path to resource, works for dev and for PyInstaller """
        try:
            # PyInstaller creates a temp folder and stores path in _MEIPASS
            base_path = sys._MEIPASS
        except Exception:
            base_path = os.path.abspath(".")

        return os.path.join(base_path, relative_path)

    def reset_ui(self):
        self.root.after(0, lambda: self.btn_run.config(state="normal", text="开始清理"))

if __name__ == "__main__":
    root = tk.Tk()
    app = GDBCleanerApp(root)
    root.mainloop()
