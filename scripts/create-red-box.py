"""Original Budget Battle model. Run: blender -b --python scripts/create-red-box.py"""
import bpy, math, random
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
def material(name,color,metal=0,rough=.6):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF');bs.inputs['Base Color'].default_value=(*color,1);bs.inputs['Metallic'].default_value=metal;bs.inputs['Roughness'].default_value=rough
 return m
leather=material('Oxblood leather',(.24,.022,.045),0,.72)
# A small original baked colour texture travels inside the GLB, with no remote assets.
rng=random.Random(19);tex=bpy.data.images.new('Leather grain',width=128,height=128);pixels=[]
for i in range(128*128):
 n=rng.uniform(.90,1.10);pixels.extend((.32*n,.055*n,.075*n,1))
tex.pixels=pixels;tex.pack();node=leather.node_tree.nodes.new('ShaderNodeTexImage');node.image=tex
leather.node_tree.links.new(node.outputs['Color'],leather.node_tree.nodes.get('Principled BSDF').inputs['Base Color'])
gold=material('Brushed brass',(.67,.43,.14),.78,.32)
dark=material('Dark red piping',(.10,.012,.021),0,.85)
lining=material('Suede lining',(.13,.018,.03),0,.95)
paper=material('Ivory papers',(.86,.81,.68),0,.95)
ink=material('Ink',(.08,.1,.12),0,.9)
def cube(name,loc,scale,mat,bevel=.025,parent=None):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=scale;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 if bevel and name != 'Stitch':
  mod=o.modifiers.new('Soft edges','BEVEL');mod.width=bevel;mod.segments=2
  bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=mod.name)
 o.data.materials.append(mat)
 if parent:o.parent=parent
 return o
def text(name,string,loc,size,mat,rotation=(math.pi/2,0,0),parent=None):
 c=bpy.data.curves.new(name,'FONT');c.body=string;c.align_x='CENTER';c.size=size;c.extrude=.0008;c.bevel_depth=0;c.resolution_u=3
 o=bpy.data.objects.new(name,c);bpy.context.collection.objects.link(o);o.location=loc;o.rotation_euler=rotation;c.materials.append(mat)
 if parent:o.parent=parent
 bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.convert(target='MESH');o.select_set(False)
 return o
# Open cavity with a substantial front, back, side panels and a paper-filled interior.
cube('Base',(0,0,.12),(2.86,.74,.18),leather)
cube('Front',(0,-.32,.82),(2.86,.12,1.28),leather)
cube('Back',(0,.32,.82),(2.86,.12,1.28),leather)
for x in [-1.37,1.37]:cube('Side',(x,0,.82),(.12,.62,1.28),leather)
cube('Interior',(0,0,.22),(2.62,.51,.04),lining)
for i in range(6):
 cube('Budget papers',(0,-.015,.62+i*.145),(2.48,.49,.105),paper,.008)
for i in range(5):cube('Envelope tab',(-.94+i*.47,-.14,1.418),(.36,.31,.025),paper,.006)
text('Inside papers','THE SETTLEMENT',(0,-.04,1.438),.11,ink,(0,0,0))
for x in [-1.25,1.25]:
 cube('Brass foot',(x,0,.027),(.2,.43,.09),gold)
 cube('Corner protector',(x,-.389,.24),(.17,.03,.23),gold,.014)
# Fine raised borders and stitches frame the front.
for x in [-1.29,1.29]:cube('Piping',(x,-.385,.81),(.018,.017,1.08),dark,.005)
for z in [.28,1.33]:cube('Piping',(0,-.385,z),(2.59,.017,.018),dark,.005)
for x in [-1.23+i*.075 for i in range(34)]:
 for z in [.32,1.29]:cube('Stitch',(x,-.399,z),(.026,.005,.006),gold,.001)
text('Embossed title','THE BUDGET',(0,-.402,.9),.145,gold)
text('Embossed subtitle','YOUR CALL.',(0,-.402,.66),.19,gold)
cube('Title rule',(0,-.4,.54),(.53,.008,.008),gold,.002)
cube('Lock plate',(0,-.406,1.30),(.28,.055,.25),gold)
cube('Keyhole',(0,-.44,1.28),(.037,.009,.064),dark,.01)
# Animate the lid around its back hinge; the handle travels with it.
bpy.ops.object.empty_add(type='PLAIN_AXES',location=(0,.34,1.47));lid=bpy.context.object;lid.name='Opening lid'
cube('Lid',(0,-.34,.045),(2.90,.78,.16),leather,.045,lid)
cube('Lid piping',(0,-.34,-.04),(2.91,.79,.025),dark,.008,lid)
for x in [-.43,.43]:
 cube('Handle mount',(x,-.34,.15),(.21,.22,.06),gold,.015,lid)
 cube('Handle upright',(x,-.34,.30),(.10,.12,.29),dark,.04,lid)
cube('Handle grip',(0,-.34,.46),(.95,.14,.12),leather,.05,lid)
for x in [-1.08,1.08]:cube('Hinge',(x,.33,1.46),(.22,.10,.12),gold,.025)
for frame,angle in [(1,0),(9,0),(40,-105),(48,-105)]:
 lid.rotation_euler.x=math.radians(angle);lid.keyframe_insert(data_path='rotation_euler',frame=frame)
bpy.context.scene.frame_start=1;bpy.context.scene.frame_end=48;bpy.context.scene.render.fps=24;bpy.context.scene.frame_set(1)
# Store an editable original alongside a compact web-ready model.
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/red-box.blend'))
bpy.ops.export_scene.gltf(filepath=str(ROOT/'public/assets/red-box.glb'),export_format='GLB',export_animations=True,export_frame_range=True,export_cameras=False,export_lights=False)
print('EXPORTED', (ROOT/'public/assets/red-box.glb').stat().st_size)
