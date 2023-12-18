"""Remove profile image from users

Revision ID: 7167f3a26b6d
Revises: f15c5d312e90
Create Date: 2023-12-17 21:28:18.984185

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7167f3a26b6d'
down_revision = 'f15c5d312e90'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('profile_image')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('profile_image', sa.VARCHAR(length=255), nullable=True))

    # ### end Alembic commands ###
