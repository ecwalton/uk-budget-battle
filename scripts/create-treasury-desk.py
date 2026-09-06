"""Original Blender Treasury desk tableau, reusing our animated red box."""
import bpy, math
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'assets/red-box.blend'))
# Keep the editable red box intact, including its animation.
def mat(name,c,metal=0,rough=.55):
 m=bpy.data.materials.new(name);m.diffuse_color=(*c,1);m.use_nodes=True
 s=m.node_tree.nodes.get('Principled BSDF');s.inputs['Base Color'].default_value=(*c,1);s.inputs['Metallic'].default_value=metal;s.inputs['Roughness'].default_value=rough;return m
teal=mat('Treasury green leather',(.027,.19,.17));edge=mat('Desk brass edge',(.64,.39,.12),.65,.3);paper=mat('Heavy cream paper',(.92,.86,.70));ink=mat('Blue black ink',(.025,.06,.08));coral=mat('Coral envelope',(.65,.12,.08));gold=mat('Coin gold',(.83,.54,.17),.65,.29)
def box(name,loc,dims,m,angle=0):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=dims;o.rotation_euler.z=angle;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(m);b=o.modifiers.new('Rounded corners','BEVEL');b.width=.035;b.segments=3;bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=b.name);return o
def cylinder(name,loc,radius,depth,m):
 bpy.ops.mesh.primitive_cylinder_add(vertices=48,radius=radius,depth=depth,location=loc);o=bpy.context.object;o.name=name;o.data.materials.append(m);b=o.modifiers.new('Coin edge','BEVEL');b.width=.015;b.segments=2;bpy.ops.object.modifier_apply(modifier=b.name)
 for p in o.data.polygons:p.use_smooth=True
 return o
def label(body,loc,size,m,angle=0):
 c=bpy.data.curves.new(body,'FONT');c.body=body;c.size=size;c.align_x='CENTER';c.extrude=.001;c.resolution_u=3;o=bpy.data.objects.new(body,c);bpy.context.collection.objects.link(o);o.location=loc;o.rotation_euler.z=angle;c.materials.append(m);bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.convert(target='MESH');o.select_set(False)
cylinder('Circular desk edge',(0,0,-.17),3.0,.16,edge)
cylinder('Green leather desk',(0,0,-.075),2.97,.08,teal)
# The policies literally share the same desk.
for i in range(4):box('Spending papers',(-1.75,-.75,.03+i*.042),(1.22,1.50,.03),paper,-.22)
box('Envelope flap',(-1.75,-.75,.21),(1.20,.72,.025),coral,-.22)
label('SPENDING',(-1.78,-.98,.23),.12,paper,-.22)
for x,y,n in [(1.9,-.65,6),(2.27,-.1,4),(1.65,-1.25,2)]:
 for i in range(n):cylinder('Revenue coin',(x,y,.025+i*.072),.27,.065,gold)
 label('£',(x,y,.025+(n-1)*.072+.04),.26,ink)
box('Budget ledger',(0,-1.62,.05),(1.78,.8,.10),paper,.03)
label('THE FIVE-YEAR PLAN',(0,-1.52,.112),.12,ink,.03)
for i in range(5):box('Ledger rule',(-.56+i*.28,-1.84,.115),(.018,.24,.009),teal)
# Fountain pen, with brass ends.
pen=box('Fountain pen',(1.29,-1.72,.07),(.09,1.02,.09),ink,-.58)
box('Pen cap',(1.52,-1.37,.07),(.10,.22,.10),gold,-.58)
scene=bpy.context.scene;scene.frame_set(1)
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/treasury-desk.blend'))
bpy.ops.export_scene.gltf(filepath=str(ROOT/'public/assets/treasury-desk.glb'),export_format='GLB',export_animations=True,export_frame_range=True,export_cameras=False,export_lights=False)
# Render the same composition as a lightweight, reduced-motion / no-WebGL fallback.
scene.render.engine='CYCLES';scene.cycles.samples=32;scene.render.resolution_x=1100;scene.render.resolution_y=900;scene.render.resolution_percentage=100;scene.render.film_transparent=True;scene.world.color=(.65,.65,.65)
for loc,power,size in [((-4,-5,7),1100,5),((4,1,5),850,4)]:
 bpy.ops.object.light_add(type='AREA',location=loc);bpy.context.object.data.energy=power;bpy.context.object.data.size=size
bpy.ops.object.camera_add(location=(4,-7,5.6));cam=bpy.context.object;cam.rotation_euler=(Vector((0,-.05,.4))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=7.2;scene.camera=cam
scene.render.image_settings.file_format='PNG';scene.render.filepath=str(ROOT/'public/assets/treasury-desk.png');bpy.ops.render.render(write_still=True)
print('Desk model bytes', (ROOT/'public/assets/treasury-desk.glb').stat().st_size)
