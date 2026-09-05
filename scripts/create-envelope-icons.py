"""Original miniature envelope illustrations, rendered locally in Blender."""
import bpy, math
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]
def mat(name,c):
 m=bpy.data.materials.new(name);m.diffuse_color=(*c,1);m.use_nodes=True;m.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value=(*c,1);m.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value=.65;return m
def box(loc,dim,m,rot=0):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.dimensions=dim;o.rotation_euler.z=rot;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(m)
 mod=o.modifiers.new('Soft edges','BEVEL');mod.width=.04;mod.segments=2;o.modifiers.new('Normals','WEIGHTED_NORMAL');return o
for kind in ['health','welfare','defence','investment','other']:
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
 cream=mat('Ivory',(.79,.72,.58));red=mat('Oxblood',(.32,.035,.06));ink=mat('Ink',(.075,.11,.14));gold=mat('Brass',(.62,.4,.13));white=mat('Paper',(.93,.89,.80))
 if kind=='health':
  box((0,0,.7),(1.8,.85,1.4),cream);box((0,0,1.44),(1.95,.97,.12),red)
  for x in [-.58,.58]:
   for z in [.5,.95]:box((x,-.441,z),(.27,.04,.25),ink)
  box((0,-.45,.3),(.34,.05,.55),ink);box((0,-.47,1.08),(.13,.05,.44),red);box((0,-.47,1.08),(.44,.05,.13),red)
 elif kind=='welfare':
  box((-.2,0,.18),(1.65,1.17,.28),red);box((-.2,-.03,.3),(1.48,1.04,.08),white);box((-.2,0,.37),(1.65,1.17,.07),red)
  box((-.2,0,.417),(.83,.48,.018),gold)
  for i in range(3):
   bpy.ops.mesh.primitive_cylinder_add(vertices=32,radius=.35,depth=.09,location=(.65,-.47,.1+i*.1));bpy.context.object.data.materials.append(gold)
 elif kind=='defence':
  box((0,0,.28),(2.0,.66,.33),ink);box((0,0,.48),(1.76,.59,.1),cream);box((.2,0,.72),(.7,.42,.4),cream);box((.2,0,.97),(.82,.5,.1),red)
  box((.2,0,1.28),(.05,.05,.62),gold);box((.39,0,1.5),(.36,.03,.22),red);box((-.6,0,.64),(.46,.08,.08),ink)
 elif kind=='investment':
  for x in [-.65,.65]:
   box((x,0,.51),(.24,.73,1.02),cream);box((x,0,1.1),(.36,.84,.13),gold)
  box((0,0,.66),(2.1,.62,.13),ink)
  for x in [-.92+i*.23 for i in range(9)]:box((x,-.29,.85),(.035,.035,.34),red)
  box((0,-.29,1.02),(2.12,.04,.045),red)
 elif kind=='other':
  box((0,0,.15),(2,1,.15),cream);box((0,0,.27),(1.78,.89,.12),cream)
  for x in [-.62,-.2,.2,.62]:box((x,-.18,.77),(.15,.25,.92),cream)
  box((0,.22,.76),(1.63,.19,.92),cream);box((0,0,1.25),(1.94,.99,.16),red)
  # Pediment as a triangle prism.
  verts=[(-1,-.5,1.33),(1,-.5,1.33),(0,-.5,1.85),(-1,.5,1.33),(1,.5,1.33),(0,.5,1.85)]
  mesh=bpy.data.meshes.new('Pediment');mesh.from_pydata(verts,[],[(0,1,2),(5,4,3),(0,3,4,1),(1,4,5,2),(2,5,3,0)]);o=bpy.data.objects.new('Pediment',mesh);bpy.context.collection.objects.link(o);o.data.materials.append(red)
 scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=24;scene.cycles.device='CPU';scene.render.resolution_x=256;scene.render.resolution_y=256;scene.render.resolution_percentage=100;scene.render.film_transparent=True
 scene.world.color=(.65,.65,.65)
 bpy.ops.object.light_add(type='AREA',location=(-3,-4,6));bpy.context.object.data.energy=500;bpy.context.object.data.shape='DISK';bpy.context.object.data.size=5
 bpy.ops.object.light_add(type='AREA',location=(4,2,4));bpy.context.object.data.energy=250;bpy.context.object.data.size=4
 bpy.ops.object.camera_add(location=(3,-5,3.1));cam=bpy.context.object;cam.rotation_euler=(Vector((0,0,.7))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=2.8;scene.camera=cam
 scene.render.image_settings.file_format='PNG';scene.render.filepath=str(ROOT/f'public/assets/{kind}.png');bpy.ops.render.render(write_still=True)
