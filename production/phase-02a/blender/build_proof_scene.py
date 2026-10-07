"""Build and optionally render the AR Interior Group Phase 02A proof.

Run with Blender's bundled Python, for example:
    blender -b --python production/phase-02a/blender/build_proof_scene.py

The scene is intentionally procedural and self-contained. It uses no external
meshes or image assets, so its output remains clearly conceptual.
"""

from pathlib import Path
import math

import bpy
from mathutils import Vector


ROOT = Path(__file__).resolve().parents[3]
PROOF_DIR = ROOT / "proof"
BLEND_PATH = PROOF_DIR / "ar-interior-group-phase-02a-proof.blend"
STAGE_FRAMES = [1, 35, 70, 105, 140, 175, 210, 245, 280, 315, 350, 380, 410, 440, 470, 500]
FRAME_END = 500
DESKTOP_SIZE = (640, 360)
MOBILE_SIZE = (360, 640)


def material(name, color, roughness=0.5, metallic=0.0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1.0)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    return mat


def cube(name, location, dimensions, mat, bevel=0.02):
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        modifier = obj.modifiers.new("soft architectural edges", "BEVEL")
        modifier.width = bevel
        modifier.segments = 2
    obj.data.materials.append(mat)
    return obj


def cylinder(name, location, radius, depth, mat):
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=radius, depth=depth, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(mat)
    return obj


def reveal(obj, start, end):
    obj.scale = (0.001, 0.001, 0.001)
    obj.keyframe_insert(data_path="scale", frame=start)
    obj.scale = (1.0, 1.0, 1.0)
    obj.keyframe_insert(data_path="scale", frame=end)
    for curve in obj.animation_data.action.fcurves:
        for key in curve.keyframe_points:
            key.interpolation = "BEZIER"


def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def camera(name, location, target, lens=32):
    data = bpy.data.cameras.new(name)
    data.lens = lens
    data.dof.use_dof = False
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    look_at(obj, target)
    return obj


def animate_camera(obj):
    path = [
        (1, (-10.5, -10.0, 5.8), (0.0, 1.0, 1.4)),
        (180, (-6.0, -8.0, 4.8), (0.5, 1.3, 1.5)),
        (350, (1.0, -7.0, 4.5), (1.4, 1.6, 1.5)),
        (500, (7.2, -5.6, 4.0), (2.0, 1.7, 1.45)),
    ]
    for frame, location, target in path:
        obj.location = location
        look_at(obj, target)
        obj.keyframe_insert(data_path="location", frame=frame)
        obj.keyframe_insert(data_path="rotation_euler", frame=frame)
    if obj.animation_data and obj.animation_data.action:
        for curve in obj.animation_data.action.fcurves:
            for key in curve.keyframe_points:
                key.interpolation = "BEZIER"


def add_area_light(name, location, energy, size, color, target=(0, 1, 0)):
    data = bpy.data.lights.new(name, "AREA")
    data.energy = energy
    data.shape = "DISK"
    data.size = size
    data.color = color
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    look_at(obj, target)
    return obj


def build_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)

    concrete = material("Concrete shell", (0.34, 0.34, 0.31), roughness=0.82)
    ivory = material("Ivory plaster", (0.76, 0.73, 0.65), roughness=0.65)
    wood = material("Natural oak", (0.38, 0.19, 0.075), roughness=0.48)
    stone = material("Warm stone", (0.42, 0.38, 0.31), roughness=0.58)
    charcoal = material("Charcoal metal", (0.025, 0.025, 0.022), roughness=0.32, metallic=0.7)
    glass = material("Soft glass", (0.14, 0.25, 0.25), roughness=0.08, metallic=0.15)
    fabric = material("Muted fabric", (0.28, 0.27, 0.24), roughness=0.88)
    green = material("Plant green", (0.08, 0.18, 0.1), roughness=0.9)

    # One coherent 14m x 9m x 3.4m shell.
    floor = cube("shell_floor", (0, 1, -0.08), (14, 9, 0.16), concrete, 0.01)
    ceiling = cube("shell_ceiling", (0, 1, 3.5), (14, 9, 0.16), concrete, 0.01)
    back = cube("shell_back_wall", (0, 5.4, 1.7), (14, 0.18, 3.4), concrete)
    left = cube("shell_left_wall", (-6.9, 1, 1.7), (0.18, 8.8, 3.4), concrete)
    right = cube("shell_right_wall", (6.9, 1, 1.7), (0.18, 8.8, 3.4), concrete)
    for obj in (floor, ceiling, back, left, right):
        reveal(obj, 1, 1)

    # Stage 2: measured planning frames and meeting-room glazing.
    for index, x in enumerate((-4.2, -1.3, 2.0, 4.6)):
        frame = cube(f"partition_frame_{index}", (x, 1.8, 1.6), (0.08, 5.8, 3.0), charcoal, 0.01)
        reveal(frame, 28, 55)
    for index, x in enumerate((2.0, 3.3, 4.6)):
        mullion = cube(f"meeting_mullion_{index}", (x, 4.0, 1.55), (0.06, 0.06, 2.8), charcoal, 0.005)
        reveal(mullion, 35, 62)

    # Stage 3: walls and ceiling structure.
    for index, (location, dimensions) in enumerate([
        ((-4.2, 4.5, 1.55), (3.2, 0.15, 3.0)),
        ((-1.3, 4.5, 1.55), (2.5, 0.15, 3.0)),
        ((4.6, 4.5, 1.55), (2.0, 0.15, 3.0)),
    ]):
        wall = cube(f"architectural_wall_{index}", location, dimensions, ivory)
        reveal(wall, 70, 105)
    for index, x in enumerate((-4.2, -1.3, 2.0, 4.6)):
        soffit = cube(f"ceiling_soffit_{index}", (x, 1.2, 3.1), (2.2, 5.8, 0.18), ivory, 0.02)
        reveal(soffit, 78, 112)

    # Stage 4: material installation.
    floor_band = cube("oak_floor_zone", (-2.4, 0.5, 0.04), (6.8, 7.2, 0.08), wood, 0.01)
    reception = cube("stone_reception_plane", (4.5, 3.5, 0.2), (3.2, 2.0, 0.3), stone, 0.04)
    wall_lining = cube("oak_wall_lining", (-6.72, 2.8, 1.55), (0.04, 4.4, 2.8), wood, 0.01)
    for obj in (floor_band, reception, wall_lining):
        reveal(obj, 112, 145)

    # Stage 5: workstation and meeting furniture.
    for index, x in enumerate((-4.4, -1.5, 1.5)):
        desk = cube(f"workstation_{index}", (x, -0.3, 0.82), (2.2, 0.85, 0.12), wood, 0.03)
        reveal(desk, 145, 178)
        for y in (-0.95, 0.35):
            leg = cube(f"workstation_leg_{index}_{y}", (x, y, 0.4), (0.06, 0.06, 0.8), charcoal, 0.01)
            reveal(leg, 148, 182)
        for chair_x in (x - 0.9, x + 0.9):
            chair = cube(f"task_chair_{index}_{chair_x}", (chair_x, 1.0, 0.48), (0.34, 0.34, 0.75), fabric, 0.12)
            reveal(chair, 155, 190)
    table = cube("meeting_table", (3.2, 3.8, 0.84), (2.4, 0.9, 0.1), wood, 0.04)
    reveal(table, 155, 190)
    for x in (1.7, 2.7, 3.7, 4.7):
        chair = cube(f"meeting_chair_{x}", (x, 2.9, 0.48), (0.32, 0.32, 0.75), fabric, 0.12)
        reveal(chair, 160, 196)

    # Stage 6/7: lighting, planting, and finishing.
    for index, x in enumerate((-4.4, -1.5, 1.5, 4.3)):
        pendant = cube(f"linear_pendant_{index}", (x, 0.3, 2.95), (1.5, 0.08, 0.08), charcoal, 0.02)
        reveal(pendant, 195, 230)
    planter = cylinder("planter", (5.4, -2.1, 0.45), 0.45, 0.9, stone)
    plant = cylinder("plant", (5.4, -2.1, 1.45), 0.12, 1.6, green)
    reveal(planter, 220, 255)
    reveal(plant, 230, 265)
    reception_front = cube("reception_front", (4.5, 3.0, 0.78), (2.4, 0.15, 1.1), ivory, 0.03)
    reveal(reception_front, 230, 275)

    # Cameras and controlled path.
    desktop = camera("Camera_Desktop", (-10.5, -10.0, 5.8), (0, 1, 1.4), 31)
    mobile = camera("Camera_Mobile", (-8.6, -11.0, 5.5), (0.5, 1.4, 1.6), 42)
    animate_camera(desktop)
    animate_camera(mobile)
    # Keep the vertical composition inside the same room, with a slightly tighter target.
    mobile.data.lens = 44

    add_area_light("window_daylight", (-4.5, -2.5, 5.5), 900, 5.0, (0.78, 0.84, 1.0), (0, 2, 0))
    add_area_light("warm_finish_light", (4.5, 2.0, 3.0), 500, 3.0, (1.0, 0.68, 0.36), (2, 1, 1))
    world = bpy.context.scene.world
    world.color = (0.035, 0.035, 0.03)
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.035, 0.035, 0.03, 1.0)
    world.node_tree.nodes["Background"].inputs["Strength"].default_value = 0.18

    scene = bpy.context.scene
    scene.frame_start = 1
    scene.frame_end = FRAME_END
    scene.render.engine = "BLENDER_EEVEE_NEXT"
    scene.render.image_settings.file_format = "WEBP"
    scene.render.image_settings.quality = 86
    scene.render.film_transparent = False
    scene.render.resolution_percentage = 100
    scene.render.filepath = str(PROOF_DIR / "desktop" / "frame-")
    scene.camera = desktop
    scene.render.resolution_x, scene.render.resolution_y = DESKTOP_SIZE
    scene.render.fps = 24
    scene.render.image_settings.color_mode = "RGB"
    scene.render.filepath = str(PROOF_DIR / "desktop" / "frame-0001.webp")
    scene.world.color = (0.035, 0.035, 0.03)

    PROOF_DIR.mkdir(parents=True, exist_ok=True)
    (PROOF_DIR / "desktop").mkdir(exist_ok=True)
    (PROOF_DIR / "mobile").mkdir(exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))


def render_set(camera_name, size, folder):
    scene = bpy.context.scene
    scene.camera = bpy.data.objects[camera_name]
    scene.render.resolution_x, scene.render.resolution_y = size
    for frame in STAGE_FRAMES:
        scene.frame_set(frame)
        scene.render.filepath = str(PROOF_DIR / folder / f"frame-{frame:04d}.webp")
        bpy.ops.render.render(write_still=True)


if __name__ == "__main__":
    build_scene()
    render_set("Camera_Desktop", DESKTOP_SIZE, "desktop")
    render_set("Camera_Mobile", MOBILE_SIZE, "mobile")
